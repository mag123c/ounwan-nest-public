import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { EUser } from "src/app/user/db/entity/user.entity";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('user_routine', { database: 'ounwan' })
export class EUserRoutine extends DefaultEntity {
    @ApiProperty({
        example: 1,
        description: 'User No',
        required: true,
    })
    @Column({ name: 'user_no', type: 'int' })
    userNo: number;

    @ApiProperty({
        example: '하체',
        description: '루틴 이름',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Column({ name: 'name', type: 'varchar', length: 40 })
    name: string;

    @ManyToOne(() => EUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_no' })
    user: EUser;
}