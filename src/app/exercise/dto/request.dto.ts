import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator";

export class DoneExercise {
    @ApiProperty({
        example: 1,
        description: '운동 번호 (PK)',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    exerciseNo: number;
    
    @ApiProperty({
        example: '스쿼트',
        description: '운동 이름',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    exerciseName: string;

    @ApiProperty({
        example: '가슴, 삼두',
        description: '타겟',
        required: true,
    })
    @IsString()
    @IsOptional()
    exerciseTargets: string;

    @ApiProperty({
        example: true,
        description: '유산소인지?',
        required: true,
    })
    @IsNotEmpty()
    @IsBoolean()
    isCardio: boolean;

    @ApiProperty({
        description: '세트당 reps / weight, 유산소의 경우 time',
        required: true,
    })
    @ValidateIf((o: DoneExercise) => o.isCardio === false)
    @ValidateNested({ each: true })
    @ArrayMinSize(1)
    @Type(() => StrengthSet)
    strengthSets: StrengthSet[];

    @ValidateIf((o: DoneExercise) => o.isCardio === true)
    time: number;

    @ApiProperty({
        example: '힘들었다',
        description: '메모',
        required: false,
    })
    @IsString()
    @IsOptional()
    memo: string;
}

export class StrengthSet {
    @ApiProperty({
        example: 10,
        description: '반복 횟수',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    reps: number;

    @ApiProperty({
        example: 10,
        description: '무게',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    weight: number;
}

export class AdminExercise {
    @ApiProperty({
        example: '1',
        description: '운동 PK',
        required: true,
    })
    @IsNumber()
    @IsNotEmpty()
    no: number;

    @ApiProperty({
        example: '스쿼트',
        description: '운동 이름',
        required: false,
    })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({
        example: '가슴, 삼두',
        description: '타겟',
        required: false,
    })
    @IsString()
    @IsOptional()
    targets: string;

    @ApiProperty({
        description: '운동 이미지 경로',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    path: string;
}