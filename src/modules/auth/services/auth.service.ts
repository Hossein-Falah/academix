import { randomInt } from 'crypto';
import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, ForbiddenException, forwardRef, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { AuthDto } from '../dto/auth.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { AuthResponse, GoogleStrategyType } from 'src/common/types';
import { AuthType } from 'src/common/enums/type.enum';
import { AuthMessage, BadRequestMessage, ConflictMessage, ForbiddenMessage, PublicMessage } from 'src/common/enums/message.enum';
import { AuthMethod } from 'src/common/enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { OtpEntity } from '../../user/entities/otp.entity';
import { TokenService } from './token.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { CookiesOptionsToken } from 'src/common/utils/cookie.util';
import { Roles } from 'src/common/enums/role.enum';
import { ProfileEntity } from 'src/modules/user/entities/profile.entity';
import { randomId } from 'src/common/utils/function.util';
import { UserService } from 'src/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
        @Inject(REQUEST) private request:Request,
        private tokenService:TokenService,
        @Inject(forwardRef(() => UserService)) private userService:UserService,
        private jwtService:JwtService
    ) {}

    async userExistence(authDto:AuthDto, res:Response) {
        const { method, type, username } = authDto;
        let result:AuthResponse;
        
        switch (type) {
            case AuthType.Login:
                result = await this.login(method, username);
                return this.sendResponse(res, result);
            case AuthType.Register:
                result = await this.register(method, username);
                return this.sendResponse(res, result);
            default:
                throw new UnauthorizedException(AuthMessage.UnAuthorizedInValid);
        }
    }

    async login(method:AuthMethod, username:string) {
        const validUsername = this.usernameValidator(method, username);

        let user = await this.checkExistUser(method, validUsername);
        if (!user) throw new NotFoundException(PublicMessage.NotFoundAccount);

        return this.handleOtpProccess(user.id, method);
    }

    async register(method:AuthMethod, username:string) {
        const validUsername = this.usernameValidator(method, username);

        let user = await this.checkExistUser(method, validUsername);
        if (user) throw new ConflictException(ConflictMessage.AlreadyExistAccount);

        if (method === AuthMethod.Username) {
            throw new BadRequestException(BadRequestMessage.InValid);
        }

        const userCount = await this.userRepository.count();

        user = this.userRepository.create({
            [method]: username,
            role: userCount === 0 ? Roles.Admin : Roles.User
        });

        user = await this.userRepository.save(user);
        user.username = `m_${randomInt(5000).toString(32)}`;
        user = await this.userRepository.save(user);

        return this.handleOtpProccess(user.id, method);
    }

    async sendOtp(userId:string, method:AuthMethod) {
        const code = randomInt(10000, 99999).toString();
        const expiresIn = new Date(Date.now() + (1000 * 60 * 2));

        let otp = await this.otpRepository.findOneBy({ userId });
        let existOtp = false;

        if (otp) {
            existOtp = true;
            otp.code = code;
            otp.expiresIn = expiresIn;
            otp.method = method;
        } else {
            otp = this.otpRepository.create({
                code,
                expiresIn,
                userId,
                method
            });
        }

        otp = await this.otpRepository.save(otp);

        if (!existOtp) {
            await this.userRepository.update({ id: userId }, {
                otpId: otp.id
            })
        };

        return otp;
    }


    async handleOtpProccess(userId:string, method: AuthMethod) {
        const now = new Date().getTime();

        const lastOtp = await this.otpRepository.findOne({
            where: { userId, method }
        })
        
        if (lastOtp?.expiresIn?.getTime() > now) throw new ForbiddenException(ForbiddenMessage.NotExpiredOtpCode);
        
        const otp = await this.sendOtp(userId, method);
        const token = this.tokenService.generateOtpToken({ userId });

        return {
            code: otp?.code,
            token
        }
    }

    async checkOtp(code:string) {
        const token = this.request.cookies?.[CookieKeys.OTP];
        if (!token) throw new UnauthorizedException(AuthMessage.ExpiredCode);

        const { userId } = this.tokenService.verifyOtpToken(token);

        const otp = await this.otpRepository.findOneBy({ userId });
        if (!otp) throw new UnauthorizedException(AuthMessage.LoginAgain);

        const now = new Date();
        
        if (otp.expiresIn < now) throw new UnauthorizedException(AuthMessage.ExpiredCode);
        if (otp.code !== code) throw new BadRequestException(AuthMessage.InValidCodeOtp);

        const accessToken = this.tokenService.generateAccessToken({ userId });
        
        if (otp.method === AuthMethod.Email) {
            await this.userRepository.update({ id: userId }, {
                verify_email: true
            })
        } else if (otp.method === AuthMethod.Phone) {
            await this.userRepository.update({ id: userId }, {
                verify_phone: true
            })
        }

        return {
            message: PublicMessage.LoggedIn,
            accessToken
        }
    }

    async sendResponse(res:Response, result:AuthResponse) {
        const { token, code } = result;
        res.cookie(CookieKeys.OTP, token, CookiesOptionsToken());

        res.json({
            message: AuthMessage.SendOtp,
            code
        })
    }

    async googleAuth(userData:GoogleStrategyType) {
        let token:string;

        const { firstName, lastName, email, image_profile } = userData;
        
        let user = await this.userRepository.findOneBy({ email });
        
        if (user) {
            token = this.tokenService.generateOtpToken({ userId: user.id });
        } else {
            user = this.userRepository.create({
                email,
                verify_email: true,
                username: `${email.split("@")[0]}-${randomId()}`
            })

            user = await this.userRepository.save(user);

            let profile = this.profileRepository.create({
                userId: user.id,
                nike_name: `${firstName} ${lastName}`,
                image_profile
            });
            profile = await this.profileRepository.save(profile);
            user.profileId = profile.id;
            await this.userRepository.save(user);
            
            token = this.tokenService.generateAccessToken({ userId: user.id })
        }

        return {
            token
        }
    }

    async validateAccessToken(token:string) {
        const { userId } = this.tokenService.verifyAccessToken(token);
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new UnauthorizedException(AuthMessage.LoginAgain);
        return user;
    }

    async checkExistUser(method:AuthMethod, username:string) {
        let user:UserEntity;

        if (method === AuthMethod.Phone) {
            user = await this.userRepository.findOneBy({ phone: username })
        } else if (method === AuthMethod.Email) {
            user = await this.userRepository.findOneBy({ email: username })
        } else if (method === AuthMethod.Username) {
            user = await this.userRepository.findOneBy({ username: username })
        } else {
            throw new BadRequestException(BadRequestMessage.InValid)
        }

        return user;
    }

    usernameValidator(method:AuthMethod, username:string) {
        switch (method) {
            case AuthMethod.Email:
                if (isEmail(username)) return username;
                throw new BadRequestException(BadRequestMessage.InValidEmail)
            case AuthMethod.Phone:
                if (isMobilePhone(username, 'fa-IR')) return username;
                throw new BadRequestException(BadRequestMessage.InValidPhoen);
            case AuthMethod.Username:
                return username;
            default:
                throw new UnauthorizedException(AuthMessage.UnAuthorizedInValid)
        }
    }

    // authention user with passport for chat-system

    async validateUser(username:string, password:string) {
        const user = await this.userService.getUserWithUsername(username);
        if (user && user.password === password) {
            return user;
        }

        return null;
    }

    async LoginWithChat(user:UserEntity) {
        const payload = { username: user.username, sub:user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}