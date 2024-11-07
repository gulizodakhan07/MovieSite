import { IsNotEmpty, IsString } from 'class-validator';
import { UploadFileRequest } from '../interface/uploadFile.interface';

export class UploadFileDto implements Omit<UploadFileRequest, 'file'> {
  @IsString()
  @IsNotEmpty()
  destination: string;

  file: any;
}
