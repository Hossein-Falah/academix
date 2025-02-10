import { Response } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Res, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { ChangeEmailDto, changePhoneDto, ProfileDto, RoleChangeDto } from './dto/profile.dto';
import { multerStorage } from 'src/common/utils/multer.util';
import { UploadedOptionalFiles } from 'src/common/decorators/upload-file.decorator';
import { ProfileImage } from 'src/common/types';
import { CanAccess } from 'src/common/decorators/role.decorator';
import { Roles } from 'src/common/enums/role.enum';
import { CheckOtpDto, UserBlockDto } from '../auth/dto/auth.dto';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { PublicMessage } from 'src/common/enums/message.enum';

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

  @Get("/users")
  @CanAccess(Roles.Admin, Roles.Teacher)
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Post('/block')
  @CanAccess(Roles.Admin, Roles.Teacher)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  async blockToggle(@Body() blockDto:UserBlockDto) {
    return this.userService.blockToggle(blockDto)
  }

  @Patch("/change-email")
  async changeEmail(@Body() emailDto: ChangeEmailDto, @Res() res:Response) {
    const { code, token, message } = await this.userService.changeEmail(emailDto.email);
    if (message) return res.json({ message });
    res.cookie(CookieKeys.EmailOTP, token, CookiesOptionsToken());
    res.json({
      code,
      message: PublicMessage.SendOTP
    })
  }

  @Post('/verify-email-otp')
  verifyEmail(@Body() otpDto:CheckOtpDto) {
    return this.userService.verifyEmail(otpDto.code)
  }

  @Patch("/change-phone")
  async changePhone(@Body() phoneDto:changePhoneDto, @Res() res:Response) {
    const { code, token, message } = await this.userService.changePhone(phoneDto.phone);
    if (message) return res.json({ message });
    res.cookie(CookieKeys.PhoneOTP, token, CookiesOptionsToken());
    res.json({
      code,
      message: PublicMessage.SendOTP
    })
  }

  @Post('/verify-phone-otp')
  verifyPhone(@Body() otpDto:CheckOtpDto) {
    return this.userService.verifyPhone(otpDto.code);
  }

  @Put("/change-role/:id")
  @CanAccess(Roles.Admin)
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  changeRole(@Param('id') id:string, @Body() roleChangeDto: RoleChangeDto) {
    return this.userService.changeRole(id, roleChangeDto)
  }

  @Delete("/:id")
  @CanAccess(Roles.Admin)
  delete(@Param('id') id:string) {
    return this.userService.delete(id)
  }
}