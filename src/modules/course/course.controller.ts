import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseDto, FilterCourseDto } from './dto/course.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { UploadFileS3 } from 'src/common/interceptors/upload.interceptor';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterCourse } from 'src/common/decorators/filter.decorator';

@Controller('course')
@ApiTags('Course')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

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
    return this.courseService.create(courseDto, image);
  }

  @Get()
  @Pagination()
  @SkipAuth()
  @FilterCourse()
  findAll(@Query() paginationDto:PaginationDto, @Query() filterDto:FilterCourseDto) {
    return this.courseService.findAll(paginationDto, filterDto);
  }
  
  @Get(':id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }
  
  @Patch(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  @UseInterceptors(UploadFileS3("cover"))
  @ApiConsumes(SwaggerConsmes.Multipart)
  update(
    @Param('id') id: string,
    @Body() courseDto: UpdateCourseDto,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" })
      ]
    })) image: Express.Multer.File
  ) {
    return this.courseService.update(id, courseDto, image);
  }
  
  @Delete(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
