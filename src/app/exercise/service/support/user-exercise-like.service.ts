import { Injectable } from "@nestjs/common";
import { InsertFail, SelectFail, UpdateFail } from "src/common/error/domain/database";
import { EUserExerciseLike } from "../../db/entity/user-like.entity";
import { UserExerciseLikeRepository } from "../../db/repository/exercise-like.repository";

@Injectable()
export class UserExerciseLikeService {
    constructor(
        private userExerciseLikeRepo: UserExerciseLikeRepository,
    ) { }

    /**
    * @description 유저가 즐겨찾기 한 운동이 있는지 확인
    * @param userNo 
    * @param exerciseNo 
    * @returns 
    */
    async findExistsExerciseLike(userNo: number, exerciseNo: number): Promise<EUserExerciseLike> {
        try {
            return await this.userExerciseLikeRepo.findOne(
                { where: { userNo: userNo, exerciseNo: exerciseNo } }
            );
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage);
        }
    }

    /**
     * @summary 즐겨찾기 추가
     * @description 기존 즐겨찾기 없을 때, insert
     * @param userNo 
     * @param exerciseNo 
     */
    async createExerciseLike(userNo: number, exerciseNo: number): Promise<void> {
        try {
            await this.userExerciseLikeRepo.save({
                userNo: userNo,
                exerciseNo: exerciseNo,
                favorite: true
            })
        }
        catch (e) {
            throw new InsertFail(e.code, e.sql, e.sqlMessage);
        }
    }

    /**
     * @summary 즐겨찾기 변경
     * @description 기존 즐겨찾기 있을 때, reverse update
     * @param exists 
     */
    async updateExerciseLike(exists: EUserExerciseLike): Promise<void> {
        try {
            await this.userExerciseLikeRepo.update(exists.no, {
                favorite: !exists.favorite
            });
        }
        catch (e) {
            throw new UpdateFail(e.code, e.sql, e.sqlMessage);
        }
    }
}