import axios from "axios"


class ApiServices {
    constructor(
        private readonly apiUrl: string = process.env.REACT_APP_API_URL
    ){}

    async uploadSmallMovie(data : FormData, { onProgress }) {
        const response = await axios.post(`${this.apiUrl}/files/small/upload`, data, {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent
                const progress = Math.round((loaded * 100) / total)
                onProgress(progress)
            },
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        return response.data
    }

    makeURLToViewMovie(filename : string){
        return `${this.apiUrl}/files/${filename}`
    }
}




export const API = new ApiServices()