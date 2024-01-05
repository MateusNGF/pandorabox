import { Repository } from 'typeorm';
import { File } from './entities/file.entity';


export class FileRepository extends Repository<File> {}