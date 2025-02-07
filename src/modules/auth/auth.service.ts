import { Response } from 'express';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto, CheckOtpDto } from './dto/auth.dto';
import { UserEntity } from '../user/entities/user.entity';
import { AuthResponse } from 'src/common/types';
import { AuthType } from 'src/common/enums/type.enum';
import { AuthMessage, BadRequestMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { AuthMethod } from 'src/common/enums/method.enum';
import { isEmail, isMobilePhone } from 'class-validator';
import { randomInt } from 'crypto';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        private tokenService:TokenService
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

        const otp = await this.sendOtp(user.id, method);
        const token = this.tokenService.generateOtpToken({ userId: user.id });

        return {
            code: otp.code,
            token
        }
    }

    async register(method:AuthMethod, username:string) {
        const validUsername = this.usernameValidator(method, username);

        let user = await this.checkExistUser(method, validUsername);
        if (user) throw new ConflictException(ConflictMessage.AlreadyExistAccount);

        if (method === AuthMethod.Username) {
            throw new BadRequestException(BadRequestMessage.InValid);
        }

        user = this.userRepository.create({
            [method]: username
        });

        user = await this.userRepository.save(user);
        user.username = `m_${user.id}`;
        user = await this.userRepository.save(user);
        const otp = await this.sendOtp(user.id, method);
        const token = this.tokenService.generateOtpToken({ userId: user.id })

        return {
            code: otp.code,
            token
        }
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

    checkOtp(checkOtpDto:CheckOtpDto) {

    }

    async sendResponse(res:Response, result:AuthResponse) {

    }

    checkLogin() {

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
}