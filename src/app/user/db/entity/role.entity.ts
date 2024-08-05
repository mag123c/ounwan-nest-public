import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity } from "typeorm";

@Entity('user_role', { database: 'ounwan' })
export class EUserRole extends DefaultEntity {
    @ApiProperty({
        example: 1,
        description: 'User ID',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'user_no', type: 'int' })
    userNo: number;

    @ApiProperty({
        example: 0,
        description: 'role',
        required: true,
    })
    @IsEnum([ 'user', 'admin' ], { each: true })
    @IsNotEmpty()
    @Column({ name: 'role', type: 'varchar' })
    role: string;
}