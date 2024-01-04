
import UploadComponent from "../components/UploadComponent"
import "./css/UploadFilesPage.css"

export default function UploadFilesPage() {

    return <>
        <div className="container-primary-uploadpage">
            <div className="container">
                <h1>UploadFilesPage</h1>
            </div>
            <div className="container-upload">
                <UploadComponent/>
            </div>
        </div>
    </>
}