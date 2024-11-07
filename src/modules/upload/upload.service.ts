import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';

import { existsSync } from 'fs';
import {
  UploadFileRequest,
  UploadFileResponse,
} from './interface/uploadFile.interface';
import {
  RemoveFileRequest,
  RemoveFileResponse,
} from './interface/removeFile.interface';
// upload.service
@Injectable()
export class UploadService {
  constructor() {}

  async uploadFile(payload: UploadFileRequest): Promise<UploadFileResponse> {
    // GENERATE UNIQUE FILE NAME
    const extName = path.extname(payload.file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = payload.file.fieldname + '-' + uniqueSuffix + extName;

    // GET FILE'S FULL PATH
    const uploadDir = path.join(__dirname, '../../../', payload.destination);
    console.log(uploadDir);
    const fullFilePath = path.join(uploadDir, fileName);
    console.log(fullFilePath);

    // CREATE UPLOAD FOLDER IF DESTINATION IS NOT FOUND
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // WRITE FILE TO DESTINATION
    fs.writeFileSync(fullFilePath, payload.file.buffer);

    // CREATE IMAGE URL
    const imageUrl = `${payload.destination}/${fileName}`;

    return {
      imageUrl,
      message: 'File written successfully',
    };
  }

  async removeFile(payload: RemoveFileRequest): Promise<RemoveFileResponse> {
    const filePath = path.join(__dirname, '../../../', payload.fileName);

    const isFileExists = existsSync(filePath);

    // CREATE UPLOAD FOLDER IF DESTINATION IS NOT FOUND
    if (isFileExists) {
      fs.unlinkSync(filePath);
    }

    return {
      message: 'File removed successfully',
    };
  }
}
