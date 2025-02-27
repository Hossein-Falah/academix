import { Request, Response } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { SwaggerConsmes } from 'src/common/enums/swagger.consumes.enum';
import { AuthService } from '../services/auth.service';
import { AuthDto, CheckOtpDto } from '../dto/auth.dto';
import { AuthGuard } from '../guard/auth.guard';

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
  @ApiBearerAuth('Authorization')
  @UseGuards(AuthGuard)
  checkLogin(@Req() req:Request) {
    return req.user;
  }

  @Post("/login-chat-system")
  async login(@Body() body: { username: string, password:string }) {
    const user = await this.authService.validateUser(body.password, body.password)
    if (!user) throw new UnauthorizedException("inValid credentials");
    return this.authService.LoginWithChat(user);
  }
}