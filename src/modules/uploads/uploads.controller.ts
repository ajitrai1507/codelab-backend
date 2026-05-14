import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';



import { CloudinaryService } from './services/cloudinary.service';
import { ApiResponse } from 'common/utils/api-response.util';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadedFile =
      await this.cloudinaryService.uploadFile(
        file,
      );

    return new ApiResponse({
      success: true,
      message: 'File uploaded successfully',
      data: uploadedFile,
    });
  }
}