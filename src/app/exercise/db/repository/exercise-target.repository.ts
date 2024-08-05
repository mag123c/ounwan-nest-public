import { Injectable } from "@nestjs/common";
import { InsertFail } from "src/common/error/domain/database";
import { DataSource, Repository } from "typeorm";
import { EExerciseTarget } from "../entity/exercise-target.entity";

@Injectable()
export class ExerciseTargetRepository extends Repository<EExerciseTarget> {

    constructor(private dataSource: DataSource) {
        super(EExerciseTarget, dataSource.createEntityManager())
    }

    async saveExerciseTarget(exerciseNo: number, targetNo: number) {
        try {
            await this.createQueryBuilder('exerciseTarget')
                .insert()
                .into(EExerciseTarget)
                .values({ exerciseNo: exerciseNo, targetNo: targetNo })
                .execute();
        }
        catch (e) {
            throw new InsertFail(e.code, e.sql, e.sqlMessage);
        }
    }
}