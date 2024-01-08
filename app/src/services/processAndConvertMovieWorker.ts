import { iWorkerProperties } from "./interfaces/iWorker";

import { API } from './ApiServices'

onmessage = async ({ data }: Partial<iWorkerProperties>) => {
  const { file } = data;

  let progress = 0;
  let done = false;


  const result = await API.uploadSmallMovie({ file }, {
    onProgress: (qts : number) => {
      progress += qts;
      postMessage({ progress, done })
    },
  })

  done = true

  postMessage({ 
    progress, 
    done, 
    url : API.makeURLToViewMovie(result.filename) 
  })
}


export {}
