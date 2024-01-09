import { iVideoTransform } from "../interfaces/iVideoTransform";

import { createFile, DataStream } from 'mp4box'

export class MP4Demuxer implements iVideoTransform  {

    private file : any
    private onConfig : any
    private onFrames : any

    constructor() {}

    async run({ stream, encode, mimetype, listiners} : iVideoTransform.iFunctionRunProperties) {
        try{
            const {  onFrames, onConfig } = listiners
    
            this.onFrames = onFrames
            this.onConfig = onConfig

            this.file = createFile()

            this.file.onReady = (info) => {
                const [track] = info.videoTracks
                this.onConfig({
                    codec: track.codec,
                    codedHeight: track.video.height,
                    codedWidth: track.video.width,
                    description: this.getDescriptionContent(track),
                    durationSecs: info.duration / info.timescale,
                })
                this.file.setExtractionOptions(track.id)
                this.file.start()
            };

            this.file.onSamples = (trackId : number, ref : any, samples : Array<any>) => {
                for (const sample of samples) {
                    this.onFrames(new EncodedVideoChunk({
                        type: sample.is_sync ? "key" : "delta",
                        timestamp: 1e6 * sample.cts / sample.timescale,
                        duration: 1e6 * sample.duration / sample.timescale,
                        data: sample.data
                    }));
                }
            }

            this.file.onError = (error) => {
                console.error('NP4DEMUXER > Erro ao processar o arquivo:', error)
            }

            return this.init(stream)
        }catch(e){
            console.error(e)
        }
    }

    private getDescriptionContent({ id }) {
        const track = this.file.getTrackById(id);
        for (const entry of track.mdia.minf.stbl.stsd.entries) {
            const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;
            if (box) {
                const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
                box.write(stream);
                return new Uint8Array(stream.buffer, 8);  // Remove the box header.
            }
        }
        throw new Error("avcC, hvcC, vpcC, or av1C box not found");
    }


    private async init(stream : ReadableStream){

        let _currentOffSet = 0

        const consumer = new WritableStream({
            write: (chunk : Uint8Array) => {
                
                try{
                    const copyBuffer = chunk.buffer as Partial<ArrayBufferLike & { fileStart : number }>
                    copyBuffer.fileStart = _currentOffSet
                    
                    this.file.appendBuffer(copyBuffer)
                    _currentOffSet += chunk.byteLength

                }catch(e){
                    console.error(e)
                }

            },
            close: () => {
                this.file.flush();
            }
        })

        return stream.pipeTo(consumer)
    }
}



