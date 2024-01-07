
export interface iWorkerProperties {
    data: iWorkerProperties.DataProperties
}

export namespace iWorkerProperties {
    export interface DataProperties {
        movie : File
    }
}

export interface iResponseWorker {
    data : {
        progress : number
        done : boolean
    }
}