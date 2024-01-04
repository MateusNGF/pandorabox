import { useRef } from "react";

interface Properties {
    placeholder?: string;
    value?: string;
    onClick?: Function;
}

export default function InputClipBoardComponent({
    placeholder, value, onClick
}: Properties) {

    const referency = useRef(null);

    const handleCopyClick = async () => {
        try {
            if (referency.current) {
                await navigator.clipboard.writeText(referency.current.value);
                console.log('Texto copiado para a área de transferência.');
            }
        } catch (err) {
            console.error('Erro ao copiar para a área de transferência:', err);
        }
    };


    return (
        <div className="container-primary-inputclipboard">
            <input ref={referency} type="text" value="Texto para copiar" readOnly />
            <button onClick={handleCopyClick}>Copiar</button>
        </div>
    );
}