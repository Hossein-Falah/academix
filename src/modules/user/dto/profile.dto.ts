import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsMobilePhone, IsOptional, IsString, Length } from "class-validator";
import { Gender } from "src/common/enums/gender.enum";
import { ValidationMessage } from "src/common/enums/message.enum";

export class ProfileDto {
    @ApiPropertyOptional()
    @IsOptional()
    @Length(3, 100)
    nike_name:string;
    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @Length(3, 200)
    bio:string;
    @ApiPropertyOptional({ type: "string", format: "binary" })
    image_profile:string;
    @ApiPropertyOptional({ type: "string", format: "binary" })
    bg_image:string;
    @ApiPropertyOptional({ nullable: true, enum: Gender })
    @IsOptional()
    @IsEnum(Gender)
    gender:string;
    @ApiPropertyOptional({ nullable: true, example: "2025-01-25T10:30:11.458Z" })
    birthday:Date;
}

export class ChangeEmailDto {
    @ApiProperty()
    @IsEmail({}, { message: ValidationMessage.InValidEmailFormat })
    @Length(3, 60)
    email:string;
}

export class changePhoneDto {
    @ApiProperty()
    @IsMobilePhone('fa-IR', {}, { message: ValidationMessage.InValidPhoneFormat })
    phone:string;
}

export class ChangeUsernameDto {
    @ApiProperty()
    @IsString()
    @Length(3, 100)
    username:string;
}
