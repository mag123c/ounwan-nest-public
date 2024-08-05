import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { DefaultEntity } from "src/common/entity/default.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { EExerciseTarget } from "./exercise-target.entity";
import { EUserExerciseLike } from "./user-like.entity";

@Entity('exercise', { database: 'ounwan' })
export class EExercise extends DefaultEntity {
    @ApiProperty({
        example: '스쿼트',
        description: '운동이름',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Column({ name: 'name', type: 'varchar', length: 40 })
    name: string;

    @ApiProperty({
        example: 'image/스쿼트.png',
        description: '이미지경로',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @Column({ name: 'url', type: 'varchar', length: 100 })
    url: string;

    @ApiProperty({
        example: 1,
        description: '유저가 선택한 횟수',
        required: false,
        default: 0,
    })
    @Column({ name: 'select_cnt', type: 'int', default: 0 })
    selectCnt: number;

    @ApiProperty({
        example: 1,
        description: '유저가 즐찾한 횟수',
        required: false,
        default: 0,
    })
    @Column({ name: 'favorite_cnt', type: 'int', default: 0 })
    favoriteCnt: number;

    @OneToMany(() => EExerciseTarget, target => target.exercise)
    targets: EExerciseTarget[];

    @OneToMany(() => EUserExerciseLike, like => like.exercise)
    likes: EUserExerciseLike[];
}