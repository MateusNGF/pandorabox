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


export type TypesConfigurationEnconder = {
    [key in string] : Partial<VideoEncoderConfig>
}

export type ResolutionsTypes = {
    [key in string] : { width : number, height : number}
}