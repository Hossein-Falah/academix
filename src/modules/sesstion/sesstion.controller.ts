import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SesstionService } from './sesstion.service';
import { SesstionDto } from './dto/sesstion.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { UploadVideoS3 } from 'src/common/interceptors/upload.interceptor';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('sesstion')
@ApiTags('sesstion')
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class SesstionController {
  constructor(private readonly sesstionService: SesstionService) {}

  @Post()
  @CanAccess(Roles.Admin, Roles.Teacher)
  @UseInterceptors(UploadVideoS3('video'))
  @ApiConsumes(SwaggerConsmes.Multipart)
  create(@UploadedFile() file:Express.Multer.File, @Body() sesstionDto: SesstionDto) {
    return this.sesstionService.create(sesstionDto, file);
  }
  
  @Get()
  @SkipAuth()
  findAll(@Param('chapterId') chapterId:string) {
    return this.sesstionService.findAll(chapterId);
  }
  
  @Delete(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  remove(@Param('id') id: string) {
    return this.sesstionService.remove(id);
  }
}
