import { useState, useEffect } from 'react';
import './css/UploadComponent.css';


import { useDropzone } from 'react-dropzone';
import ProgressBarComponent from './ProgressBarComponent';
import { formartBytes } from '../utils/conversor';
import { toast, } from 'react-toastify';
import { iResponseWorker } from 'utils/processor/interfaces/iWorker';

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
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: callback,
        accept: {
            'video': ['video/*' ],
        },
        onDropRejected(fileRejections, event) {
            fileRejections.forEach(fileRejection => {
                toast(`Arquivo ${fileRejection.file.name} do tipo ${fileRejection.file.type} não permitido!`, { type: 'error' })
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

    useEffect(() => {
        const workerToProcessMovies = new Worker(
            new URL('../utils/processor/worker', import.meta.url),
            {
                type: 'module'
            }
        );
    
        workerToProcessMovies.onmessage = ({ data }: Partial<iResponseWorker>) => {
            const { done, progress } = data;
            if (done) {
                // Encerra o worker após a conclusão
                workerToProcessMovies.terminate();
            }

            console.log(done, progress)
            setProgress(progress);
        }
        workerToProcessMovies.onerror = (error) => {
            // Trate erros no worker aqui
            console.error('Erro no Worker:', error);
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
                    <ProgressBarComponent progress={progress} />
                </div>
            </div>
        </div>
    </>
}