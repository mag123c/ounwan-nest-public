import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { EUser } from "src/app/user/db/entity/user.entity";
import { DefaultEntity2 } from "src/common/entity/default.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { EExercise } from "./exercise.entity";

@Entity('user_exercise', { database: 'ounwan' })
export class EUserExercise extends DefaultEntity2 {
    @ApiProperty({
        example: 1,
        description: 'User No',
        required: true,
    })
    @Column({ name: 'user_no' })
    userNo: number;

    @ApiProperty({
        example: 1,
        description: '운동 No',
        required: true,
    })
    @Column({ name: 'exercise_no' })
    exerciseNo: number;

    @ApiProperty({
        example: 1,
        description: '세트수',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Column({ name: 'sets', type: 'int' })
    sets: number;

    @ApiProperty({
        example: 1,
        description: '운동 횟수',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    @Column({ name: 'reps', type: 'int' })
    reps: number;

    @ApiProperty({
        example: 1,
        description: '운동 무게',
        required: false,
    })
    @Column({ name: 'weight', type: 'int' })
    @IsNumber()
    @IsOptional()
    weight: number;

    @ApiProperty({
        example: 10,
        description: '운동 시간(유산소 전용)',
        required: false,
    })
    @Column({ name: 'time', type: 'int' })
    @IsNumber()
    @IsOptional()
    time: number;

    @ApiProperty({
        example: '오늘은 ㅈㄴ무거웠다',
        description: 'memo',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Column({ name: 'memo', type: 'text', nullable: true })
    memo: string;

    @ManyToOne(() => EUser, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_no' })
    user: EUser;

    @ManyToOne(() => EExercise)
    @JoinColumn({ name: 'exercise_no' })
    exercise: EExercise;

    buildStrength(userNo: number, exerciseNo: number, sets: number, reps: number, weight: number, createdAt: Date, memo: string) {
        this.userNo = userNo;
        this.exerciseNo = exerciseNo;
        this.sets = sets;
        this.reps = reps;
        this.weight = weight;
        this.createdAt = createdAt;
        this.memo = memo;
        return this;
    }
    buildCardio(userNo: number, exerciseNo: number, createdAt: Date, time: number, memo: string) {
        this.userNo = userNo;
        this.exerciseNo = exerciseNo;
        this.createdAt = createdAt;
        this.time = time;
        this.memo = memo;
        return this;
    }
}