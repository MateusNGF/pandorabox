import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRepository } from './files.repository';

@Injectable()
export class FilesService {
  
  constructor(
    @InjectRepository(FileRepository)
    private readonly fileRepository : FileRepository
  ){}


}
