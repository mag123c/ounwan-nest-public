import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { ESnsType } from "../../util/enum";

export class UserInfo {
    @ApiProperty({
        example: "test1",
        description: 'User ID',
        required: true,
    })
    @IsString()
    @IsOptional()
    @Length(4, 50)
    userId: string;

    @ApiProperty({
        example: "test1",
        description: 'User Password',
        required: true,
    })
    @IsString()
    @IsOptional()
    @Length(4, 20)
    password?: string;
}

export class ExtraUserInfo extends UserInfo {
    @ApiProperty({
        example: '우웩',
        description: 'User Nickname',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    nickname: string;

    @ApiProperty({
        example: 1,
        description: 'sex',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    sex: number;

    @ApiProperty({
        example: '18',
        description: 'User Age',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    year: number;

    @ApiProperty({
        example: '180',
        description: 'User Height',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    height: string;

    @ApiProperty({
        example: '90',
        description: 'User Weight',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    weight: string;

    @ApiProperty({
        enum: ESnsType,
        description: 'SNS Type',
        required: true,
    })
    @IsEnum(ESnsType)
    @IsNotEmpty()
    snsType: ESnsType;

    @ApiProperty({
        description: 'sns PK',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    snsNo: string;

    @ApiProperty({
        description: 'refresh token',
    })
    @IsString()
    @IsOptional()
    refreshToken?: string;    
}


export class SignInDto {
    @ApiProperty({
        example: "test1",
        description: 'User ID',
        required: true,
    })
    userId: string;
    @ApiProperty({
        example: "test1",
        description: 'User Password',
        required: true,
    })
    password: string;
}