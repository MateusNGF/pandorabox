import {
  Controller, Post, UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FilesService } from './files.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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
        destination: './temp',
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
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }

}
