import { EnconderResolution, iWorkerProperties } from "./interfaces/iWorker";

import { API } from './ApiServices'

import VideoProcessor from "./VideoProcessor";
import { MP4Demuxer as MP4Demuxer } from "./VideoTransform/MP4Demuxer";

onmessage = async ({ data }: Partial<iWorkerProperties>) => {
  const { file } = data;

  await transformToLowResolution(file)


  // 1º Transformar para baixa resolução

  // let progress = 0;
  // let done = false;


  // const result = await API.uploadSmallMovie({ file }, {
  //   onProgress: (qts : number) => {
  //     progress += qts;
  //     postMessage({ progress, done })
  //   },
  // })

  // done = true

  // postMessage({ 
  //   progress, 
  //   done, 
  //   url : API.makeURLToViewMovie(result.filename) 
  // })
}



async function transformToLowResolution(file: File) {

  const constraint = {
    qvga: { width: 320, height: 240 },
    vga: { width: 640, height: 480 },
    hd: { width: 1280, height: 720 },
  }

  const enconderConfig = {
    webm: {
      bitrate: 10e6, // 1 MB/s
      codec: 'vp09.00.10.08',
      pt: 4,
      hardwareAcceleration: 'prefer-software',
    },
    mp4: {
      bitrate: 10e6, // 1 MB/s
      codec: 'avc1.42002A',
      pt: 1,
      hardwareAcceleration: 'prefer-hardware',
    }
  }

  const videoTransform = new MP4Demuxer();
  const videoProcessor = new VideoProcessor(videoTransform);

  await videoProcessor.start({
    file,
    encode: {
      ...enconderConfig.webm,
      ...constraint.vga
    }
  })
}


export { }
