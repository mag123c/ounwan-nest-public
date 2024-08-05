import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { EExercise } from "./exercise.entity";
import { ETarget } from "./target.entity";

@Entity('exercise_target', { database: 'ounwan' })
export class EExerciseTarget extends DefaultEntity {
    @ApiProperty({
        example: 1,
        description: '운동 번호',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'exercise_no' })
    exerciseNo: number;

    @ApiProperty({
        example: 1,
        description: '타겟 번호',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'target_no' })
    targetNo: number;    

    @ManyToOne(() => EExercise, { onDelete: 'CASCADE' })
    exercise: EExercise;

    @ManyToOne(() => ETarget, { onDelete: 'CASCADE' })
    target: ETarget;
}