import { iVideoTransform } from "./interfaces/iVideoTransform";
import { EnconderConfiguration } from "./interfaces/iWorker";


export default class VideoProcessor {

    constructor(
        private readonly videoTransform : iVideoTransform
    ) {}

    async start({ file, encode, renderFrame} : iVideoProcessor.iFunctionStartProperties){
        const stream = file.stream()
        const filename = file.name.split('.')[0];

        await this.MP4Decoder(stream, encode, file.type)
        .pipeTo(
            new WritableStream({
                write(frame : VideoFrame){
                    renderFrame(frame)
                }
            })
        )
    }
    
    private MP4Decoder(stream, encode, mimetype) {
       return new ReadableStream({
            start : async (controller) => {
                const decoder = new VideoDecoder({
                    error: (error) => {
                        console.error('MP4BoxError : ', error)
                        controller.error(error)
                    },
                    output: (frame : VideoFrame) => {
                        // repassa o frame para quem estiver lendo.
                        controller.enqueue(frame)
                    }
                })
                
                // Processa e extrai os dados do video e repassa para o VideoEncoder
                await this.videoTransform.run({
                    stream, 
                    encode, 
                    mimetype,
                    listiners: {
                        onFrames: (chunk : EncodedVideoChunk) => {
                            decoder.decode(chunk)
                        },
                        onConfig: (config) => {
                            decoder.configure(config as any)
                        }
                    }
                })
            }
       })
    }

}


export namespace iVideoProcessor {
    export interface iFunctionStartProperties {
        file : File,
        encode : EnconderConfiguration,
        renderFrame : (frame : VideoFrame) => void
    }
}