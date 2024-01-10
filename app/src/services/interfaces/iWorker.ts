export interface iWorkerProperties {
    data: iWorkerProperties.DataProperties
}

export namespace iWorkerProperties {
    export interface DataProperties {
        file : File
        canvas : OffscreenCanvas
    }
}

export interface iResponseWorker {
    data : {
        progress : number
        done : boolean
        url : string
    }
}


export interface EnconderResolution {
    width: number,
    height: number
}

export interface EnconderConfiguration extends EnconderResolution {
    bitrate: number, // 1 MB/s
    codec: string,
    pt: number,
    hardwareAcceleration: string,
}