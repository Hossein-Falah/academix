import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { ProfileDto } from './dto/profile.dto';
import { multerStorage } from 'src/common/utils/multer.util';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { ProfileImage } from 'src/common/types';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { UserBlockDto } from '../auth/dto/auth.dto';

@Controller('user')
@ApiTags("User")
@AuthDecorator()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put("/profile")
  @ApiConsumes(SwaggerConsmes.Multipart)
  @UseInterceptors(FileFieldsInterceptor([
    { name: "image_profile", maxCount: 1 },
    { name: "bg_image", maxCount: 1 }
  ], {
    storage: multerStorage('user-profile')
  }))
  changeProfile(
    @UploadedOptionalFiles() files:ProfileImage,
    @Body() profileDto:ProfileDto
  ) {
    return this.userService.changeProfile(files, profileDto);
  }

  @Get('/profile')
  getProfile() {
    return this.userService.getProfile();
  }

  @Post('/block')
  @CanAccess(Roles.Admin)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  async blockToggle(@Body() blockDto:UserBlockDto) {
    return this.userService.blockToggle(blockDto)
  }
}