
import './css/ProgressBarComponent.css';

interface Properties {
    progress: number
}

export default function ProgressBarComponent({ progress  }: Properties) {
    const fillStyle = {
        width: `${progress}%`,
    };

    return (
        <div className='container-primary-progressbar'>
            <div className="progress-bar">
                <div className="progress-fill" style={fillStyle}>
                    <span>{progress}% </span>
                </div>
            </div>
        </div>
    );
}