import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { isDate } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { ProfileImage } from 'src/common/types';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { Gender } from 'src/common/enums/gender.enum';
import { AuthMessage, PublicMessage } from 'src/common/enums/message.enum';
import { EntityNames } from 'src/common/enums/entity.enum';
import { BaseEntity } from 'src/common/abstracts/base.entity';
import { UserBlockDto } from '../auth/dto/auth.dto';
import { UserStatus } from 'src/common/enums/status.enum';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity) private profileRepository: Repository<ProfileEntity>,
    @Inject(REQUEST) private request:Request
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

    let message = AuthMessage.Blocked;

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
}
