import {
  Controller, Get, Param, Post, Res, UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FilesService } from './files.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('/small/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 500, // 20MB (ajuste conforme necessário)
      },
      storage: diskStorage({
        destination: './src/temp',
        filename(_req, _file, callback) {
          const filename = `${Date.now()}.${_file.originalname.split('.')[1]}`;
          callback(null, filename);
        },

      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      console.log(file)
      return {
        originalname: file.originalname,
        filename: file.filename
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }

  @Get(':filename')
  async serveVideo(
    @Param('filename') filename: string, 
    @Res() res: Response
  ): Promise<void> {
    const videoPath = path.join('./', './src/temp', filename);

    if (!fs.existsSync(videoPath)) {
      res.status(404).send('Not Found');
      return;
    }

    const videoStat = fs.statSync(videoPath);

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');

    const range = res.req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoStat.size - 1;

      const stream = fs.createReadStream(videoPath, { start, end });
      stream.on('open', () => {
        res.status(206).header({
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes ${start}-${end}/${videoStat.size}`,
          'Content-Length': (end - start) + 1,
        });

        stream.pipe(res);
      });
    } else {
      const stream = fs.createReadStream(videoPath);
      res.header({
        'Content-Type': 'video/mp4',
        'Content-Length': videoStat.size,
      });

      stream.pipe(res);
    }
  }
}
