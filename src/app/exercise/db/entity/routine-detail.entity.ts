import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { EExercise } from "./exercise.entity";
import { EUserRoutine } from "./user-routine.entity";

@Entity('routine_detail', { database: 'ounwan' })
export class ERoutineDetail extends DefaultEntity {
    @ApiProperty({
        example: 1,
        description: '루틴 번호',
        required: true,
    })
    @Column({ name: 'routine_no' })
    routineNo: number;

    @ApiProperty({
        example: 1,
        description: '운동 번호',
        required: true,
    })
    @Column({ name: 'exercise_no' })
    exerciseNo: number;

    @ApiProperty({
        example: 1,
        description: '등록된 순서',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    @Column({ name: 'order' })
    order: number;

    @ManyToOne(() => EUserRoutine, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'routine_no' })
    routine: EUserRoutine;

    @ManyToOne(() => EExercise, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exercise_no' })
    exercise: EExercise;
}