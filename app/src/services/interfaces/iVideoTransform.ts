
export abstract class iVideoTransform {
    abstract run(content : iVideoTransform.iFunctionRunProperties) : Promise<any>
}

export namespace iVideoTransform {
    export interface iFunctionRunProperties {
        stream : ReadableStream,
        mimetype : string,
        encode : any,
        listiners : iVideoTransform.TransformListiners
    }

    export interface TransformListiners {
        onConfig : (config : object) => any
        onFrames : (chunk : any) => any
    }
}