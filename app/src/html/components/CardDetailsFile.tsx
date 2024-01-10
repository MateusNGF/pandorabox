import { useEffect, useState, useRef } from "react";
import { iResponseWorker } from "services/interfaces/iWorker";
import { formartBytes } from "utils/conversor";
import InputClipBoardComponent from "./InputClipBoardComponent";
import ProgressBarComponent from "./ProgressBarComponent";
import { RxLapTimer } from "react-icons/rx";
import { PiIdentificationBadgeThin } from "react-icons/pi";
import { AiOutlineOrderedList } from "react-icons/ai";
import { BsMemory } from "react-icons/bs";



import './css/CardDetailsFile.css';

interface iCardDetailsProperties {
    file: File
    index: number,
    onError: ({ message }) => void
    onSucess: ({ message }) => void
    onFinish: ({ message }) => void
}

export default function CardDetailsFile({
    file, index, onError, onSucess, onFinish
}: iCardDetailsProperties) {

    const [progress, setProgress] = useState<number>(0);
    const [urlFile, setUrlFile] = useState<string>(null);    
    const canvasPreview = useRef<HTMLCanvasElement>();
    
    useEffect(() => {
        const workerToProcessMovies = new Worker(
            new URL('../../services/worker', import.meta.url),
            {
                type: 'module'
            }
        );

        workerToProcessMovies.onmessage = async ({ data }: Partial<iResponseWorker>) => {
            const { done, progress, url } = data;
            if (done) {
                // Encerra o worker após a conclusão
                workerToProcessMovies.terminate();
                setUrlFile(url);
                onFinish({
                    message: `Arquivo ${index}º concluído com sucesso!`
                })
            }

            setProgress(progress);
        }
        workerToProcessMovies.onerror = (error) => {
            console.error('Erro no Worker:', error);
            onError({
                message: `Erro no processamento do ${index}º Arquivo: ${error.message}`
            })
        }

        try {
            const canvasOffscreen = canvasPreview?.current && canvasPreview.current?.transferControlToOffscreen()
            workerToProcessMovies.postMessage({
                file,
                canvas: canvasOffscreen
            }, [canvasOffscreen]);
        }catch(error){
            console.log(error)
            onError({
                message: `Erro no processamento do ${index}º Arquivo: Tente novamente!`
            })
        }   

        return () => {
            // Remova os ouvintes quando o componente for desmontado
            workerToProcessMovies.terminate();
        };
    }, []);

    return <>
        <div className='card-file-details'>
            <div className='header'>
                <canvas 
                    ref={canvasPreview}
                    className="canvas-preview"
                />
                <div className="information">
                    <span><AiOutlineOrderedList />Posição: {index}</span><br/>
                    <span><PiIdentificationBadgeThin />Nome: {file.name}</span><br/>
                    <span><BsMemory/>Tamanho: {formartBytes(file.size)}</span>
                </div>
            </div>
            <div className='fotter'>
                <div className='fotter-progress-bar'>
                    {
                        urlFile
                            ? <InputClipBoardComponent
                                value={urlFile}
                                callback={(copy: boolean) => {
                                    copy
                                        ? onSucess({ message: 'Link copiado com sucesso!' })
                                        : onError({ message: 'Erro ao copiar o link!' });
                                }}
                            />
                            : <ProgressBarComponent
                                progress={progress}
                            />
                    }
                </div>
                <span><RxLapTimer/> 20s </span>
            </div>
        </div>
    </>
}