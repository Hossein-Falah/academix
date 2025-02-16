import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Query, Put } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { BlogDto, FilterBlogDto, StatusBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { UploadFileS3 } from 'src/common/interceptors/upload.interceptor';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('blog')
@ApiTags("Blog")
@AuthDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @CanAccess(Roles.Admin, Roles.Teacher)
  @ApiConsumes(SwaggerConsmes.Multipart)
  @UseInterceptors(UploadFileS3("image"))
  create(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" })
      ]
    })) image: Express.Multer.File,
    @Body() blogDto: BlogDto
  ) {
    return this.blogService.create(blogDto, image);
  }

  @Get("/me")
  myBlog() {
    return this.blogService.myBlog()
  }

  @Get()
  @Pagination()
  @SkipAuth()
  @FilterBlog()
  findAllWithQuery(@Query() paginationDto:PaginationDto, @Query() filterDto:FilterBlogDto) {
    return this.blogService.findAllWithQuery(paginationDto, filterDto);
  }

  @Get(":id")
  @SkipAuth()
  findOne(@Param('id') id:string) {
    return this.blogService.findOne(id);
  }

  @Get("/search-slug/:slug")
  @SkipAuth()
  @Pagination()
  @FilterBlog()
  findOneBySlug(@Param('slug') slug:string, @Query() paginationDto:PaginationDto) {
    return this.blogService.findOneBySlug(slug, paginationDto);
  }

  @Patch(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  @UseInterceptors(UploadFileS3('image'))
  @ApiConsumes(SwaggerConsmes.Multipart)
  update(
    @Param('id') id: string, 
    @Body() blogDto: UpdateBlogDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: "image/(png|jpg|jpeg|webp)" })
        ]
      })
    )
    image: Express.Multer.File
  ) {
    return this.blogService.update(id, blogDto, image);
  }

  @Patch(":id/status")
  @CanAccess(Roles.Admin, Roles.Teacher)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  async changeStatus(
    @Param("id") id:string,
    @Body() statusDto:StatusBlogDto
  ) {
    return this.blogService.changeStatus(id, statusDto.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }

  @Put('/like/:id')
  likeToggle(@Param('id') id:string) {
    return this.blogService.likeToggle(id);
  }

  @Put('/bookmark/:id')
  bookmarkToggle(@Param('id') id:string) {
    return this.blogService.bookmarkToggle(id);
  }
}
