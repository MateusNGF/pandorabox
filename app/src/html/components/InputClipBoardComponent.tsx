import './css/InputClipBoardComponent.css';
import { useRef } from "react";
import { FaCopy } from "react-icons/fa";

interface Properties {
    value?: string;
    callback?: any;
}

export default function InputClipBoardComponent({
    value, callback
}: Properties) {

    const referency = useRef(null);

    const handleCopyClick = async () => {
        try {
            if (referency.current) {
                await navigator.clipboard.writeText(referency.current.value);
                callback({ copy : true})
            }
        } catch (err) {
            console.error('Erro ao copiar para a área de transferência:', err);
            callback({ copy : false})
        }
    };


    return (
        <div className="container-primary-inputclipboard" onClick={handleCopyClick}>
            <input
                className='input-clipboard'
                ref={referency}
                type="text"
                value={value}
                readOnly
            />
            <button
                className="button-copy"
            >
                <FaCopy size={20} />
            </button>
        </div>
    );
}