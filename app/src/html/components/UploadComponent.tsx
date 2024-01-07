import './css/UploadComponent.css';

import { useState, useEffect } from 'react';

import { toast, } from 'react-toastify';
import { useDropzone } from 'react-dropzone';

import ProgressBarComponent from './ProgressBarComponent';

import { formartBytes } from '../../utils/conversor';
import { iResponseWorker } from '../../services/interfaces/iWorker';
import InputClipBoardComponent from './InputClipBoardComponent';


export default function UploadComponent() {
    const [fileSelecteds, setFileSelecteds] = useState<Array<File>>([]);

    return (
        <div className='container-primary-dropzone'>
            <DropZoneAndInputMovies callback={setFileSelecteds} />
            {
                fileSelecteds?.map((file, index) => {
                    return <CardDetails file={file} index={index + 1} />
                }) ?? null
            }
        </div>
    );
}


interface iDropZoneAndInputFilesProperties {
    callback: any
}

function DropZoneAndInputMovies({ callback }: iDropZoneAndInputFilesProperties) {
    const MAX_SIZE_BYTES = 50 * 1024 * 1024
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: callback,
        accept: {
            'video': ['video/*' ],
        },
        maxSize: MAX_SIZE_BYTES,
        onDropRejected(fileRejections, event) {
            fileRejections.forEach(fileRejection => {
                let message = null

                switch (fileRejection.errors[0].code) {
                    case 'file-too-large':
                        message = `O arquivo ${fileRejection.file.name} ultrapassa o limite de ${formartBytes(MAX_SIZE_BYTES)}`
                        break;
                    case 'file-invalid-type':
                        message = `O arquivo ${fileRejection.file.name} do tipo ${fileRejection.file.type} não é permitido`
                        break;
                    default:
                        break;
                }

                toast.error(message)
            })
        },
    });
    return (
        <div {...getRootProps()} className='container-dropzone-input'>
            <input {...getInputProps()} accept='video/*' />
            <span>SELECIONE OU JOGUE OS ARQUIVOS</span>
        </div>
    )
}

interface iCardDetailsProperties {
    file: File
    index: number
}

function CardDetails({ file, index }: iCardDetailsProperties) {
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
            }

            setProgress(progress);
        }
        workerToProcessMovies.onerror = (error) => {
            // Trate erros no worker aqui
            console.error('Erro no Worker:', error);
            toast.error('Erro no Worker:' + error.message)
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
                                        ? toast.success('Link copiado com sucesso')
                                        : toast.error('Erro ao copiar o link');
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