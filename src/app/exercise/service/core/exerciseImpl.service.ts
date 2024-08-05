import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { UpdateFail } from 'src/common/error/domain/database';
import { TargetNotFound } from 'src/common/error/domain/exercise';
import { exerciseLogger } from 'src/common/logger/api.logger';
import { ResponseMessage } from 'src/common/response/response';
import { Transactional } from 'typeorm-transactional';
import { EUserExerciseLike } from '../../db/entity/user-like.entity';
import { ExerciseRepository } from '../../db/repository/exercise.repository';
import { AdminExercise, DoneExercise } from '../../dto/request.dto';
import { ExerciseResponse } from '../../dto/response.dto';
import { ExerciseTargetService } from '../support/exercise-target.service';
import { UserExerciseLikeService } from '../support/user-exercise-like.service';
import { UserExerciseService } from '../support/user-exercise.service';
import { IExerciseService } from './exerciseITF.service';

@Injectable()
export class ExerciseServiceImpl implements IExerciseService {

    constructor(
        private exerciseTargetService: ExerciseTargetService,
        private userExerciseService: UserExerciseService,
        private userExerciseLikeService: UserExerciseLikeService,
        private exerciseRepo: ExerciseRepository,
    ) { }

    async getExerciseList(userNo: number): Promise<ExerciseResponse[]> {
        try {
            return await this.exerciseRepo.getExerciseList(userNo);
        }
        catch (e) {
            throw e;
        }
    }

    @Transactional({ connectionName: 'ounwanDataSource' })
    async createExercise(path: string, name: string, targets: string): Promise<void> {
        try {
            if (!targets) throw new TargetNotFound();

            const exerciseNo = await this.exerciseRepo.saveExercise(name, path);
            await this.exerciseTargetService.saveExerciseTarget(exerciseNo, targets);
        }
        catch (e) {
            throw e;
        }
    }

    @Transactional({ connectionName: 'ounwanDataSource' })
    async modifyExercise(filename: string, exercise: AdminExercise): Promise<void> {

        try {
            const exist = await this.exerciseRepo.findOne({
                where: {
                    no: exercise.no
                }
            });

            // 이미지 변경 시 업로드 및 기존 이미지 삭제
            if (filename && exist.url !== filename) {
                await this.modifyWhenImageChange(filename, exercise);
            }            

            else {
                await this.exerciseRepo.update(exercise.no, {
                    name: exercise.name,
                }).catch((e) => {
                    console.error(e);
                    throw new UpdateFail(e.code, e.sql, e.sqlMessage)
                });
            }

            await this.exerciseTargetService.updateExerciseTarget(exercise.no, exercise.targets);
        }
        catch (e) {
            throw e;
        }
    }

    async modifyWhenImageChange(filename: string, exercise: AdminExercise) {
        try {
            await this.exerciseRepo.update(exercise.no, {
                name: exercise.name,
                url: filename,
            }).catch((e) => {
                throw new UpdateFail(e.code, e.sql, e.sqlMessage)
            });

            await this.deleteImage(filename).catch((e) => {
                throw e;
            });

        }
        catch (e) {
            throw e;
        }
    }

    @Transactional({ connectionName: 'ounwanDataSource' })
    async deleteExercise(no: number, imagePath: string): Promise<void> {
        try {
            //row delete
            await this.deleteImage(imagePath)

            await this.exerciseRepo.delete(no);
        }
        catch (e) {
            throw e;
        }
    }

    /**
     * @description row data 삭제 후 이미지 파일 삭제
     * @param imagePath 
     */
    async deleteImage(imagePath: string): Promise<void> {
        const fullPath = join('./static', imagePath);
        try {
            await unlink(fullPath);
            exerciseLogger('delete', `[Exercise] 운동 이미지 삭제 성공(${fullPath})`);
        } catch (e) {
            exerciseLogger('error', `[Exercise] 운동 이미지 삭제 실패[존재하지 않는 이미지](${fullPath}): ${e} `);
        }
    }

    @Transactional({ connectionName: 'ounwanDataSource' })
    async changeExerciseFavorite(userNo: number, exerciseNo: number): Promise<ResponseMessage> {
        try {
            const exists: EUserExerciseLike = await this.userExerciseLikeService.findExistsExerciseLike(userNo, exerciseNo);
            let favorite: boolean = true;

            if (exists) {
                await this.userExerciseLikeService.updateExerciseLike(exists);
                favorite = !exists.favorite;
            }
            else {
                await this.userExerciseLikeService.createExerciseLike(userNo, exerciseNo);
            }

            await this.updateExerciseFavoriteCnt(exerciseNo, favorite);

            exerciseLogger('update', { userNo: userNo, exerciseNo: exerciseNo, favorite: favorite });

            return {
                status: exists ? 200 : 201,
                message: `즐겨찾기 변경 성공(${favorite ? '즐겨찾기 추가' : '즐겨찾기 삭제'})`
            }
        }
        catch (e) {
            exerciseLogger('error', `[Exercise] 운동 즐겨찾기 변경 실패: ${e} `);
            throw e;
        }
    }

    /**
     * @summary 유저의 즐겨찾기에 따라 카운트 변경
     * @param exerciseNo 
     * @param favorite 
     */
    async updateExerciseFavoriteCnt(exerciseNo: number, favorite: boolean) {
        try {
            await this.exerciseRepo.update(exerciseNo, {
                favoriteCnt: favorite ? () => 'favoriteCnt + 1' : () => 'favoriteCnt - 1'
            })
        }
        catch (e) {
            throw new UpdateFail(e.code, e.sql, e.sqlMessage)
        }
    }


    @Transactional({ connectionName: 'ounwanDataSource' })
    async recordDoneExercise(userNo: number, date: string, doneExerciseDto: DoneExercise[]): Promise<ResponseMessage> {
        try {
            for (const done of doneExerciseDto) {
                const isInsert = await this.userExerciseService.upsertDailyExercise(userNo, new Date(date), done);

                if (isInsert) {
                    await this.updateSelectedCount(done.exerciseNo);
                }
            }

            await this.userExerciseService.updateLastWorkout(userNo, date);

            exerciseLogger('record', { userNo: userNo, date: date, doneExerciseDto: doneExerciseDto });
            return new ResponseMessage(201, '운동 기록 성공');
        }
        catch (e) {
            exerciseLogger('error', `[Exercise] 운동 기록 실패(${userNo}, ${date}, ${doneExerciseDto}): ${e} `);
            throw e;
        }
    }

    async updateSelectedCount(exerciseNo: number): Promise<void> {
        await this.exerciseRepo.update(exerciseNo, {
            selectCnt: () => 'selectCnt + 1'
        }).then(() => {
            exerciseLogger('selected', { exerciseNo: exerciseNo });
        })
    }

    async getImagePath(no: number): Promise<string> {
        try {
            return await this.exerciseRepo.getImagePath(no);
        }
        catch (e) {
            exerciseLogger('error', `[Exercise] 운동 이미지 가져오기 실패(exerciseNo : ${no})`);
            throw e;
        }
    }

}
