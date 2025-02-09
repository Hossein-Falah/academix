import { Request } from 'express';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ProfileDto } from './dto/profile.dto';
import { ProfileImage } from 'src/common/types';
import { UserEntity } from './entities/user.entity';
import { ProfileEntity } from './entities/profile.entity';
import { isDate } from 'class-validator';
import { Gender } from 'src/common/enums/gender.enum';
import { PublicMessage } from 'src/common/enums/message.enum';

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
      profileDto.image_profile = image?.path?.slice(7);
    }

    if (files?.bg_image?.length > 0) {
      let [image] = files?.bg_image;
      profileDto.bg_image = image?.path?.slice(7);
    }

    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepository.findOneBy({ userId });
    let { nike_name, bio, image_profile, bg_image, birthday, gender } = profileDto;
    if (profile) {
      if (nike_name) profile.nike_name = nike_name;
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = new Date(birthday);
      if (gender && Object.values(Gender as any).includes(gender)) profile.gender = gender;
      if (image_profile) profile.image_profile = image_profile; 
      if (bg_image) profile.bg_image = bg_image;
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
}
