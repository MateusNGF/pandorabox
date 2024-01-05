import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { FileRepository } from './files.repository';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [
    TypeOrmModule.forFeature([FileRepository])
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
