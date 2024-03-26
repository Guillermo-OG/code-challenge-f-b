import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileUploadService } from './file-upload.service'; // Adjust import path as needed

@Controller('file-upload')
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const { validRows, invalidRows, metrics } =
      await this.fileUploadService.processFile(file);
    return {
      message: 'File uploaded and processed successfully',
      validRows,
      invalidRows,
      metrics,
    };
  }
}
