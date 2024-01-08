import { useDropzone } from "react-dropzone";
import { formartBytes } from "utils/conversor";

import './css/DropzoneComponent.css';

interface iDropZoneAndInputFilesProperties {
    onError: ({ message }) => void
    onDrop: any
    title: string
    maxSizeBytes?: number
}

export default function DropZoneAndInputMovies({
    onDrop, onError,
    title,
    maxSizeBytes = 50 * 1024 * 1024
}: iDropZoneAndInputFilesProperties) {

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        accept: {
            'video': ['video/*'],
        },
        maxSize: maxSizeBytes,
        onDropRejected(fileRejections, event) {
            fileRejections.forEach(fileRejection => {
                switch (fileRejection.errors[0].code) {
                    case 'file-too-large':
                        onError({
                            message: `O arquivo ${fileRejection.file.name} ultrapassa o limite de ${formartBytes(maxSizeBytes)}`
                        })
                        break;
                    case 'file-invalid-type':
                        onError({
                            message: `O arquivo ${fileRejection.file.name} do tipo ${fileRejection.file.type} não é permitido`
                        })
                        break;
                    default:
                        break;
                }

                return;
            })
        },
    });
    return (
        <div {...getRootProps()} className='container-dropzone-input'>
            <input {...getInputProps()} />
            <span>{title}</span>
        </div>
    )
}