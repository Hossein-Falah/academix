import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { ProfileImage } from 'src/common/types';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { AuthMessage, BadRequestMessage, ConflictMessage, PublicMessage } from 'src/common/enums/message.enum';
import { EntityNames } from 'src/common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { UserBlockDto } from '../auth/dto/auth.dto';
import { UserStatus } from 'src/common/enums/status.enum';
import { AuthService } from '../auth/services/auth.service';
import { AuthMethod } from 'src/common/enums/method.enum';
import { TokenService } from '../auth/services/token.service';
import { CookieKeys } from 'src/common/enums/cookie.enum';
import { OtpEntity } from './entities/otp.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    @Inject(REQUEST) private request:Request,
    private authService:AuthService,
    private tokenService:TokenService
  ) {}

  async changeProfile(files:ProfileImage, profileDto: ProfileDto) {
    if (files?.image_profile?.length > 0) {
      let [image] = files?.image_profile;      
      profileDto.image_profile = image?.path?.replace(/\.+(?=\.[^.]+$)/, '');
    }

    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image;
      profileDto.bg_image = image?.path?.replace(/\.+(?=\.[^.]+$)/, '');
    }

    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    let { nike_name, bio, image_profile, bg_image, birthday, gender } = profileDto;
    
    if (profile) {
      if (nike_name) profile.nike_name = nike_name;
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
      if (image_profile) profile.image_profile = image_profile.replace(/\\/g, "/"); 
      if (bg_image) profile.bg_image = bg_image.replace(/\\/g, "/");
    } else {
      profile = this.profileRepository.create({
        nike_name, bio, gender,
        image_profile, bg_image,
        birthday, userId
      })
    }

    profile = await this.profileRepository.save(profile);
    if (!profileId) {
      await this.userRepository.update({ id: userId }, { profileId: profile.id });
    }

    return {
      message: PublicMessage.Updated
    }
  }

  async getProfile() {
    const { id } = this.request.user as BaseEntity;
    return this.userRepository.createQueryBuilder(EntityNames.User)
      .where({ id })
      .leftJoinAndSelect("user.profile", "profile")
      .getOne()
  }

  async blockToggle(blockDto:UserBlockDto) {
    const { userId } = blockDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException(PublicMessage.NotFound);

    let message = AuthMessage.UserBlock;

    if (user.status === UserStatus.Block) {
      message = AuthMessage.UnBlock;
      await this.userRepository.update({ id: userId }, { status: null })
    } else {
      await this.userRepository.update({ id: userId }, { status: UserStatus.Block });
    }

    return {
      message
    }
  }

  async changeEmail(email:string) {
    const { id } = this.request.user;

    const user = await this.userRepository.findOneBy({ email });

    if (user && user?.id !== id) {
      throw new ConflictException(ConflictMessage.AlreadyEmail);
    } else if (user && user.id === id) {
      return {
        message: PublicMessage.Updated
      }
    }

    await this.userRepository.update({ id }, { new_email: email });
    const otp = await this.authService.sendOtp(id, AuthMethod.Email);
    const token = this.tokenService.generateEmailToken({ email });

    return {
      code: otp.code,
      token
    }
  }

  async verifyEmail(code:string) {
    const { id:userId, new_email } = this.request.user;
    const token = this.request.cookies?.[CookieKeys.EmailOTP];    
    if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);
    const { email } = this.tokenService.verifyEmailToken(token);
    if (email !== new_email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }

    const otp = await this.checkOtp(userId, code);
    
    if (otp.method !== AuthMethod.Email) {
      throw new BadRequestException(BadRequestMessage.SomeThingWrong);
    }

    await this.userRepository.update({ id: userId }, {
      email,
      verify_email: true,
      new_email: null
    })

    return {
      message: PublicMessage.Updated
    }
  }

  async checkOtp(userId:string, code:string) {    
    const otp = await this.otpRepository.findOneBy({ userId });
    if (!otp) throw new BadRequestException(PublicMessage.NotFoundAccount);
    const now = new Date();
    if (otp.expiresIn < now) throw new BadRequestException(AuthMessage.ExpiredCode);
    if (otp.code !== code) throw new BadRequestException(AuthMessage.InValidCodeOtp);

    return otp
  }
}