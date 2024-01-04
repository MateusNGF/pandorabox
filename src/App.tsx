import './App.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UploadFilesPage from './pages/UploadFilesPage';


function App() {
  return (
    <>
    <ToastContainer />
    <UploadFilesPage/>
    </>
  );
}

export default App;
