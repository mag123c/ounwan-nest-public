import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { EUserExercise } from "../entity/user-exercise.entity";

@Injectable()
export class UserExerciseRepository extends Repository<EUserExercise> {    
    constructor(private datasource: DataSource) {
        super(EUserExercise, datasource.createEntityManager())
    }

    /**
     * @summary 유저의 일별 운동 조회
     * @param no 
     * @param date 
     */
    async findDailyDoneExercise(userNo: number, date: string): Promise<EUserExercise[]> {
        try {
            return await this.createQueryBuilder('ue')
                .where('ue.userNo = :userNo', { userNo })
                .andWhere('ue.createdAt = :date', { date })
                .orderBy('ue.exerciseNo', 'ASC')
                .addOrderBy('ue.sets', 'ASC')
                .getMany();
        }
        catch (e) {

        }
    }

}