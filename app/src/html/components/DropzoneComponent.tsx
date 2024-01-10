import { useDropzone } from "react-dropzone";
import { formartBytes } from "utils/conversor";

import './css/DropzoneComponent.css';

interface iDropZoneAndInputFilesProperties {
    onError: ({ message }) => void
    onDrop: any
    title: string
    maxSizeBytes?: number
    accept?: { [key : string] : Array<string> }
}

export default function DropZoneAndInputMovies({
    onDrop, onError,
    title,
    maxSizeBytes = 2000 * 1024 * 1024,
    accept = { 'video': ['video/mp4'] }
}: iDropZoneAndInputFilesProperties) {

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: onDrop,
        accept: accept,
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
                        const typesAccepteds = Object.values(accept).map((types) => types.join(', '))
                        onError({
                            message: `Arquivo ${fileRejection.file.name} não aceito. Tipos permitidos : ${typesAccepteds}.`
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