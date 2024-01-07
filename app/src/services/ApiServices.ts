import axios from "axios"


class ApiServices {
    constructor(
        private readonly apiUrl: string = process.env.REACT_APP_API_URL
    ){}

    async uploadMoview(data : FormData, { onProgress }) {
        const response = await axios.post(`${this.apiUrl}/files/small/upload`, data, {
            onUploadProgress: (progressEvent) => {
                const { loaded, total } = progressEvent
                const progress = Math.round((loaded * 100) / total)
                onProgress(progress)
            },
            
        })

        return response.data
    }
}




export const API = new ApiServices()