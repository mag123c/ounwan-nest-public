import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany } from "typeorm";
import { EBodyInfo } from "../../../body/db/entity/bodyinfo.entity";
import { ExtraUserInfo } from "../../dto/request/signin.dto";
import { ESnsType } from "../../util/enum";

/**
 * @description User Entity
 */
@Entity('user', { database: 'ounwan' })
export class EUser extends DefaultEntity {

    @ApiProperty({
        example: 'test1',
        description: 'User ID',
        required: true,
    })
    @IsString()
    @IsNotEmpty()    
    @Length(4, 50)
    @Column({ name: 'user_id', type: 'varchar', unique: true })
    userId: string;

    @ApiProperty({
        example: '190kg 100cm',
        description: 'User Nickname',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(2, 20)
    @Column({ name: 'nickname', type: 'varchar', unique: true })
    nickname: string;

    @ApiProperty({
        example: 1,
        description : 'sex',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'sex', type: 'tinyint' })
    sex: number;

    @ApiProperty({
        example: '1995',
        description: 'birth year',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'year', type: 'tinyint' })
    year: number;

    @ApiProperty({
        example: '90',
        description: 'height',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(10)
    @Column({ name: 'height', type: 'varchar', length: 10})
    height: string;

    @ApiProperty({
        example: '100',
        description: 'weight',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Length(10)
    @Column({ name: 'weight', type: 'varchar', length: 10})
    weight: string;

    @ApiProperty({
        example: '1',
        enum: ESnsType,
        required: true,
    })
    @IsEnum(ESnsType)
    @IsNotEmpty()
    @Column({ name: 'sns_type', type: 'tinyint', enum: ESnsType })
    snsType: ESnsType;

    @ApiProperty({
        description: 'sns pk',
        required: true,
    })
    @IsString()
    @IsOptional()
    @Column({ name: 'sns_no', type: 'bigint' })
    snsNo: string;

    @ApiProperty({
        description: 'refresh_token'
    })
    @IsString()
    @IsOptional()
    @Column({ name: 'refresh_token', type: 'text', nullable: true })
    refreshToken: string;

    @ApiProperty({
        description: '마지막 운동일자',
        required: false,
    })
    @IsOptional()
    @Column({ name: 'last_workout', type: 'datetime', nullable: true })
    lastWorkout: Date;

    @ApiProperty({
        description: 'last logined'        
    })
    @CreateDateColumn({ name: 'last_logined', type: 'datetime', nullable: true })
    lastLogined: Date;

    @OneToMany(() => EBodyInfo, bodyInfo => bodyInfo.user)
    @JoinColumn({ name: 'no', referencedColumnName: 'userNo' })
    bodyInfo: EBodyInfo[];

    role?: string;


    dtoToEntity({ userId, nickname, sex, year, height, weight, snsType, snsNo }: ExtraUserInfo) {
        this.userId = userId;
        this.nickname = nickname;
        this.sex = sex;
        this.year = year;
        this.height = height;
        this.weight = weight;
        this.snsType = snsType;
        this.snsNo = snsNo;

        return Object.assign(this, { userId, nickname, sex, year, height, weight, snsType, snsNo });        
    }

    tokenToEntity({ no, userId, snsNo, role }: any) {
        this.no = no;
        this.userId = userId;
        this.snsNo = snsNo;
        this.role = role;

        return Object.assign(this, { no, userId, snsNo, role });
    }

}