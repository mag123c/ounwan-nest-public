import { Injectable } from "@nestjs/common";
import { InsertFail, SelectFail } from "src/common/error/domain/database";
import { DataSource, Repository } from "typeorm";
import { EExercise } from "../entity/exercise.entity";

@Injectable()
export class ExerciseRepository extends Repository<EExercise> {

    constructor(private dataSource: DataSource) {
        super(EExercise, dataSource.createEntityManager())
    }

    /**
     * @summary Save exercise
     * @description Save exercise then return the PK
     * @param name 
     * @param imgPath 
     * @returns insert NO (PK)
     */
    async saveExercise(name: string, imgPath: string): Promise<number> {
        try {
            return await this.createQueryBuilder('exercise')
                .insert()
                .into(EExercise)
                .values({ name: name, url: imgPath })
                .execute()
                .then((result) => {
                    return result.raw.insertId;
                });
        }
        catch (e) {
            throw new InsertFail(e.code, e.sql, e.sqlMessage);
        }
    }

    /**
     * @summary FE에 전달할 운동관련 정보 커스터마이징
     * @description userNo로 조인연산 최적화, group_concat으로 targetName을 배열로 만들어서 반환
     * @param userNo 
     * @returns getRawMany()
     */
    async getExerciseList(userNo: number) {
        try {
            return await this.createQueryBuilder('exercise')
                .innerJoinAndSelect('exercise.targets', 'targets')
                .innerJoinAndSelect('targets.target', 'target')
                .leftJoinAndSelect('exercise.likes', 'likes', 'likes.userNo = :userNo', { userNo: userNo })
                .select([
                    'exercise.no AS no',
                    'exercise.name AS name',
                    'exercise.url AS path',
                    'exercise.selectCnt AS selectCnt',
                    'exercise.favoriteCnt AS favoriteCnt',
                    'likes.favorite AS favorite',
                    'group_concat(target.name) AS targets',
                ])
                .groupBy('exercise.no')
                .addGroupBy('exercise.name')
                .addGroupBy('exercise.url')
                .addGroupBy('exercise.selectCnt')
                .addGroupBy('exercise.favoriteCnt')
                .addGroupBy('likes.favorite')
                .orderBy('likes.favorite', 'DESC')
                .getRawMany();
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage)
        }
    }

    async getImagePath(no: number): Promise<string> {
        try {
            return await this.createQueryBuilder('exercise')
                .select('exercise.url')
                .where('exercise.no = :no', { no: no })
                .getOne()
                .then((result) => result.url);
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage);
        }
    }

}