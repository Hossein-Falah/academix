import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UserEntity } from '../user/entities/user.entity';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './services/token.service';
import { GoogleStrategy } from './services/google.strategy';
import { GoogleAuthController } from './controllers/goole.controller';
import { ProfileEntity } from '../user/entities/profile.entity';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: "1h" }
    }),
    TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, JwtService, TokenService, GoogleStrategy, UserService],
  exports: [AuthService, JwtService, TokenService, GoogleStrategy, TypeOrmModule]
})
export class AuthModule {}
