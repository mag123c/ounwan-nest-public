import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";


class BaseBodyInfoDto {
    @ApiProperty({
        example: 100,
        description: 'User height',
        required: false,
    })
    @IsOptional()
    height: string;

    @ApiProperty({
        example: 100,
        description: 'User weight',
        required: false,
    })
    @IsOptional()
    weight: string;

    @ApiProperty({
        example: 20,
        description: 'User fat',
        required: false,
    })
    @IsOptional()
    fat: string;

    @ApiProperty({
        example: 20,
        description: 'User muscleMass',
        required: false,
    })
    @IsOptional()
    muscleMass: string;
}

/**
 * @description 유저 바디 정보 요청 DTO
 * @property {string} height - 키
 * @property {string} weight - 몸무게
 * @property {string} fat - 체지방량
 * @property {string} muscleMass - 근육량
 * @property {Date} createdAt - 생성일(선택한 날짜)
 */
export class SaveBodyInfoDto extends BaseBodyInfoDto {
    @ApiProperty({
        description: 'Created date',
        required: true,
    })
    @IsNotEmpty()
    createdAt: Date;
}

export class ChangeBodyInfo extends SaveBodyInfoDto {
    @ApiProperty({
        description: 'PK',
        required: true
    })
    @IsNotEmpty()
    no: number;
}