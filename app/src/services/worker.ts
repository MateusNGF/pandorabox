import { CanvasRender } from "./CanvasRender";
import { iWorkerProperties } from "./interfaces/iWorker";

import VideoProcessor from "./VideoProcessor";
import { MP4Demuxer } from "./VideoTransform/MP4Demuxer";

onmessage = async ({ data }: Partial<iWorkerProperties>) => {
  const { file, canvas } = data;

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
  const canvasRender = new CanvasRender(canvas)
  const videoProcessor = new VideoProcessor(videoTransform);

  await videoProcessor.start({
    file,
    renderFrame : canvasRender.getRenderer(),
    encode: {
      ...enconderConfig.mp4,
      ...constraint.qvga
    }
  })
}


export { }
