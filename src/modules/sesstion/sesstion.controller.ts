import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SesstionService } from './sesstion.service';
import { SesstionDto } from './dto/sesstion.dto';
import { UpdateSesstionDto } from './entities/sesstion.entity';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UploadVideoS3 } from 'src/common/interceptors/upload.interceptor';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';

@Controller('sesstion')
@ApiTags('sesstion')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class SesstionController {
  constructor(private readonly sesstionService: SesstionService) {}

  @Post()
  @UseInterceptors(UploadVideoS3('video'))
  @ApiConsumes(SwaggerConsmes.Multipart)
  create(@UploadedFile() file:Express.Multer.File, @Body() sesstionDto: SesstionDto) {
    return this.sesstionService.create(sesstionDto, file);
  }

  @Get()
  findAll() {
    return this.sesstionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sesstionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() sesstionDto: UpdateSesstionDto) {
    return this.sesstionService.update(id, sesstionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sesstionService.remove(+id);
  }
}
