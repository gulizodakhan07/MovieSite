import { IsNotEmpty, IsString } from 'class-validator';
import { RemoveFileRequest } from '../interface/removeFile.interface';

export class RemoveFileDto implements RemoveFileRequest {
  @IsString()
  @IsNotEmpty()
  fileName: string;
}
