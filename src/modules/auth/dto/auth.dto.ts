import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Length } from "class-validator";
import { AuthMethod } from "src/common/enums/method.enum";
import { AuthType } from "src/common/enums/type.enum";

export class AuthDto {
    @ApiProperty()
    @IsString()
    @Length(3, 20)
    username:string;
    @ApiProperty({ enum: AuthType })
    @IsEnum(AuthType)
    type:string;
    @ApiProperty({ enum: AuthMethod })
    @IsEnum(AuthMethod)
    method:AuthMethod;
}

export class CheckOtpDto {
    @ApiProperty()
    @IsString()
    @Length(5, 5)
    code:string;
}