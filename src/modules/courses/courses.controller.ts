import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseDto } from './dto/course.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { UploadFileS3 } from 'src/common/interceptors/upload.interceptor';

@Controller('courses')
@ApiTags('Courses')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @CanAccess(Roles.Admin, Roles.Teacher)
  @ApiConsumes(SwaggerConsmes.Multipart)
  @UseInterceptors(UploadFileS3('cover'))
  create(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" })
      ]
    })) image: Express.Multer.File,
    @Body() courseDto: CourseDto
  ) {
    return this.coursesService.create(courseDto, image);
  }

  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }
  
  @Patch(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }
  
  @Delete(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  remove(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
