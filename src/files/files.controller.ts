import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Get, UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { fileStorage } from './storeg';
@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: fileStorage,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return file;
  }
}
