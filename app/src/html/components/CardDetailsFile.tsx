import { useEffect, useState } from "react";
import { iResponseWorker } from "services/interfaces/iWorker";
import { formartBytes } from "utils/conversor";
import InputClipBoardComponent from "./InputClipBoardComponent";
import ProgressBarComponent from "./ProgressBarComponent";

import './css/CardDetailsFile.css';

interface iCardDetailsProperties {
    file: File
    index: number,
    onError: ({ message }) => void
    onAction: ({ message }) => void
    onFinish: () => void
}

export default function CardDetailsFile({
    file, index, onError, onAction, onFinish
}: iCardDetailsProperties) {

    const [progress, setProgress] = useState<number>(0);
    const [urlFile, setUrlFile] = useState<string>(null);

    useEffect(() => {
        const workerToProcessMovies = new Worker(
            new URL('../../services/processAndConvertMovieWorker', import.meta.url),
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
                onFinish()
            }

            setProgress(progress);
        }
        workerToProcessMovies.onerror = (error) => {
            console.error('Erro no Worker:', error);
            onError({
                message: `Erro no processamento do arquivo ${index}º : ${error.message}`
            })
        }

        workerToProcessMovies.postMessage({
            movie: file,
        });

        return () => {
            // Remova os ouvintes quando o componente for desmontado
            workerToProcessMovies.terminate();
        };
    }, [file]);

    return <>
        <div className='card-file-details'>
            <div className='header'>
                <span className='file-index'>{index}</span>
                <span className='file-name'>{file.name}</span>
            </div>
            <div className='fotter'>
                <p>{formartBytes(file.size)}</p>
                <div className='fotter-progress-bar'>
                    {
                        urlFile
                            ? <InputClipBoardComponent
                                value={urlFile}
                                callback={(copy: boolean) => {
                                    copy
                                        ? onAction({ message: 'Link copiado com sucesso!' })
                                        : onError({ message: 'Erro ao copiar o link!' });
                                }}
                            />
                            : <ProgressBarComponent
                                progress={progress}
                            />
                    }
                </div>
            </div>
        </div>
    </>
}