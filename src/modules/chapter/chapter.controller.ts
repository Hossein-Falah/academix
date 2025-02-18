import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterDto, UpdateChapterDto } from './dto/chapter.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('chapter')
@ApiTags("chapter")
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

  @Post()
  @CanAccess(Roles.Admin, Roles.Teacher)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  create(@Body() chapterDto: ChapterDto) {
    return this.chapterService.create(chapterDto);
  }

  @Get()
  @SkipAuth()
  findAll(@Param('courseId') courseId:string) {
    return this.chapterService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chapterService.findOne(id);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete(':id')
  @CanAccess(Roles.Admin, Roles.Teacher)
  remove(@Param('id') id: string) {
    return this.chapterService.remove(id);
  }
}
