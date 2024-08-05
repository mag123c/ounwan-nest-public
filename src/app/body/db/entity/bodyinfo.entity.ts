import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, Length } from "class-validator";
import { DefaultEntity2 } from "src/common/entity/default.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { EUser } from "../../../user/db/entity/user.entity";
import { SaveBodyInfoDto } from "../../dto/request.dto";

/**
 * @description User Body Info Entity
 */
@Entity('user_bodyinfo', { database: 'ounwan' })
export class EBodyInfo extends DefaultEntity2 {

    @ApiProperty({
        example: 1,
        description: 'User No',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'user_no' })
    userNo: number;

    @ApiProperty({
        example: 90,
        description: 'Height',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Column({ name: 'height', nullable: true, type: 'varchar', length: 10 })
    height: string;

    @ApiProperty({
        example: 90,
        description: 'Weight',
        required: true,
    })
    @IsNumber()
    @IsOptional()
    @Length(10)
    @Column({ name: 'weight', nullable: true, type: 'varchar', length: 10 })
    weight: string;

    @ApiProperty({
        example: 20,
        description: 'Fat',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Length(10)
    @Column({ name: 'fat', nullable: true, type: 'varchar', length: 10 })
    fat: string;

    @ApiProperty({
        example: 20,
        description: 'Muscle Mass',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Length(10)
    @Column({ name: 'muscle_mass', nullable: true, type: 'varchar', length: 10 })
    muscleMass: string;

    @ManyToOne(() => EUser, user => user.bodyInfo, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_no', referencedColumnName: 'no' })
    user: EUser;


    /**
     * @summary 바디 정보 엔터티 생성
     * @param userNo 
     * @param dto
     * 저장을 위한 Request DTO
     * @returns entity
     */
    build(userNo: number, { height, weight, fat, muscleMass, createdAt }: SaveBodyInfoDto) {
        this.userNo = userNo;

        if (height) this.height = height;
        if (weight) this.weight = weight;
        if (fat) this.fat = fat;
        if (muscleMass) this.muscleMass = muscleMass;
        this.createdAt = createdAt;

        return this;
    }
}