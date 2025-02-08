import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './services/token.service';
import { GoogleStrategy } from './services/google.strategy';
import { GoogleAuthController } from './controllers/goole.controller';
import { ProfileEntity } from '../user/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, JwtService, TokenService, GoogleStrategy],
  exports: [AuthService, JwtService, TokenService, GoogleStrategy, TypeOrmModule]
})
export class AuthModule {}
