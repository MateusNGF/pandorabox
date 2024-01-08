
import HeaderComponent from "../elements/HeaderComponent"

import "./css/UploadFilesPage.css"
import { useEffect, useState } from "react";
import DropZoneAndInputMovies from "html/components/DropzoneComponent";
import { toast } from "react-toastify";
import CardDetailsFile from "html/components/CardDetailsFile";

export default function UploadFilesPage() {
    const [fileSelecteds, setFileSelecteds] = useState<Array<File>>([]);

    return <>
        <div className="container-primary-uploadpage">
            <HeaderComponent />
            <div className="container-upload">
                    <DropZoneAndInputMovies 
                        onDrop={setFileSelecteds}
                        onError={({message}) => toast.error(message)}
                        title="ARRASTE OU CLIQUE PARA CARREGAR"
                    />
                    {
                        fileSelecteds 
                            ?  fileSelecteds.map((file, index) => (
                                <CardDetailsFile
                                    key={index}
                                    file={file}
                                    index={index + 1}
                                    onError={({message}) => toast.error(message)}
                                    onSucess={({message}) => toast.success(message)}
                                    onFinish={({message}) => toast.success(message)}
                                />
                            ))
                            : null
                    }
            </div>
        </div>
    </>
}