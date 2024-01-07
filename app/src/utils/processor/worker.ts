import { iWorkerProperties } from "./interfaces/iWorker";

onmessage = async ({ data }: Partial<iWorkerProperties>) => {
  const { movie } = data;

  let progress = 0;
  let done = false;

  return await new Promise((resolve, reject) => {
    const idIntervalo = setInterval(() => {
      progress += 5;
  
      // Verifica se a tarefa está completa
      if (progress >= 100) {
        done = true;
        progress = 100; // Garante que o progresso não exceda 100
        clearInterval(idIntervalo); // Limpa o intervalo para parar os updates
      }
      
      // Enviar o progresso e o status de 'done' de volta para o thread principal
      resolve(postMessage({ progress, done }))
      
    }, Math.random() * 5000);
  })
}


export {}