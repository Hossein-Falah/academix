import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, Length } from "class-validator";

export class SesstionDto {
    @ApiProperty({ type: "string" })
    @IsNotEmpty({ message: "عنوان جلسه اجباری می باشد" })
    @Length(5, 255)
    title: string
    @ApiProperty()
    order: number;
    @ApiProperty({ type: "boolean" })
    @IsBoolean()
    @Transform(({ value }) => value === 'true' || value === true)
    isFree:boolean;
    @ApiProperty({ type: "string", format: "binary" })
    video:string;
    @ApiProperty()
    chapterId:string;
}