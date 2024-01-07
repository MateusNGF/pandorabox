import { iWorkerProperties } from "./interfaces/iWorker";

import { API } from './ApiServices'

onmessage = async ({ data }: Partial<iWorkerProperties>) => {
  const { movie } = data;

  let progress = 0;
  let done = false;

  const form = new FormData();
  form.append('file', movie);

  const result = await API.uploadSmallMovie(form, {
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


function fakeUpload(cb){
  let progress = 0;
  let done = false;
  const idIntervalo = setInterval(() => {
    progress += 5;
  
    // Verifica se a tarefa está completa
    if (progress >= 100) {
      done = true;
      progress = 100; // Garante que o progresso não exceda 100
      clearInterval(idIntervalo); // Limpa o intervalo para parar os updates
    }
    
    // Enviar o progresso e o status de 'done' de volta para o thread principal
    cb({ progress, done })
  }, Math.random() * 5000);
}
