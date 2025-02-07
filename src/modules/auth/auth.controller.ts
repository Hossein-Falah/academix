import { Response } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { AuthService } from './auth.service';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/user-existence")
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  userExistence(@Body() authDto: AuthDto, @Res() res:Response) {
    return this.authService.userExistence(authDto, res);
  }

  @Post("/check-otp")
  @ApiConsumes(SwaggerConsmes.UrlEncoded, SwaggerConsmes.Json)
  checkOtp(@Body() checkOtpDto:CheckOtpDto) {
    return this.authService.checkOtp(checkOtpDto.code);
  }

  @Get("/check-login")
  checkLogin() {
    
  }
}