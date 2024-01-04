import { useState } from 'react';
import './css/UploadComponent.css';

import { useDropzone } from 'react-dropzone';
import ProgressBarComponent from './ProgressBarComponent';
import { formartBytes } from '../utils/conversor';
import { toast, } from 'react-toastify';

export default function UploadComponent({ }) {
    const [fileSelecteds, setFileSelecteds]: [Array<File>, Function] = useState();

    return (
        <div className='container-primary-dropzone'>
            <DropZoneAndInputFiles callback={setFileSelecteds} />
            {
                fileSelecteds && <CardDetails files={fileSelecteds} />
            }
        </div>
    );
}


interface iDropZoneAndInputFilesProperties {
    callback: any
}

function DropZoneAndInputFiles({ callback }: iDropZoneAndInputFilesProperties) {
    const { getRootProps, getInputProps } = useDropzone({
        onDrop: callback,
        accept: {
            'image': ['image/jpeg', 'image/png'],
            'text': ['text/plain', 'text/html']
        },
        onDropRejected(fileRejections, event) {
            fileRejections.forEach(fileRejection => {
                toast(`Arquivo ${fileRejection.file.name} do tipo ${fileRejection.file.type} não permitido!`, { type: 'error' })
            })
        },
    });
    return (
        <div {...getRootProps()} className='container-dropzone-input'>
            <input {...getInputProps()} accept='image/*, text/*, application/*' />
            <span>SELECIONE OU JOGUE OS ARQUIVOS</span>
        </div>
    )
}

interface iCardDetailsProperties {
    files: Array<File>
}

function CardDetails({ files }: iCardDetailsProperties) {
    const [progress, setProgress]: [number, (n: number) => void] = useState(0);

    return <>
        {
            files.map((file, index) => {
                return (
                    <div className='card-file-details'>
                        <div className='header'>
                            <span className='file-index'>{index + 1}</span>
                            <span className='file-name'>{file.name}</span>
                        </div>
                        <div className='fotter'>
                            <p>{formartBytes(file.size)}</p>
                            <div className='fotter-progress-bar'>
                                <ProgressBarComponent progress={80} />
                            </div>
                        </div>
                    </div>
                )
            })
        }
    </>
}