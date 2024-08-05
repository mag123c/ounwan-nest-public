import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { EUser } from "src/app/user/db/entity/user.entity";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { EExercise } from "./exercise.entity";

@Entity('user_exercise_like', { database: 'ounwan' })
export class EUserExerciseLike extends DefaultEntity {
    @ApiProperty({
        example: 1,
        description: 'User No',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'user_no', type: 'int' })
    userNo: number;

    @ApiProperty({
        example: 1,
        description: '운동 번호',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'exercise_no', type: 'int' })
    exerciseNo: number;

    @ApiProperty({
        example: 1,
        description: '좋아요 여부',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'favorite', type: 'tinyint' })
    favorite: boolean;

    @ManyToOne(() => EUser, { onDelete: 'CASCADE' })
    user: EUser;

    @ManyToOne(() => EExercise, { onDelete: 'CASCADE' })
    exercise: EExercise;
}