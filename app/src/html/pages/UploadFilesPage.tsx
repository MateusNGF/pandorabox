
import HeaderComponent from "../elements/HeaderComponent"
import UploadComponent from "../components/UploadComponent"

import "./css/UploadFilesPage.css"

export default function UploadFilesPage() {

    return <>
        <div className="container-primary-uploadpage">
            <HeaderComponent />
            <div className="container-upload">
                <UploadComponent />
            </div>
        </div>
    </>
}