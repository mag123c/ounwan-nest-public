import { Injectable } from "@nestjs/common";
import { SelectFail } from "src/common/error/domain/database";
import { ExerciseTargetRepository } from "../../db/repository/exercise-target.repository";
import { TargetRepository } from "../../db/repository/target.repository";

@Injectable()
export class ExerciseTargetService {

    constructor(
        private exerciseTargetRepo: ExerciseTargetRepository,
        private targetRepo: TargetRepository,
    ) { }

    /**
     * @summary RDB ExerciseTarget 관계 저장
     * @description exerciseNo를 가지고 targetNo를 찾아서 저장 
     * @param exerciseNo 
     * @param targets 
     */
    async saveExerciseTarget(exerciseNo: number, targets: string) {
        for (const target of targets.split(',')) {
            const targetNo = await this.getTargetNo(target);
            this.exerciseTargetRepo.saveExerciseTarget(exerciseNo, targetNo.no);
        }
    }

    /**
     * @summary RDB ExerciseTarget 관계 수정
     * @description exerciseTarget 일괄 삭제 후 재등록
     * @param no 
     * @param targets 
     */
    async updateExerciseTarget(exerciseNo: number, targets: string) {
        await this.exerciseTargetRepo.delete({ exerciseNo: exerciseNo });
        await this.saveExerciseTarget(exerciseNo, targets);
    }

    async getTargetNo(target: string) {
        try {
            return await this.targetRepo.findOne({ where: { name: target } });
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage);
        }
    }

    /**
     * @description 운동번호로 포함된 타겟 전체 가져오기
     * @param exerciseNo 
     * @returns targetName[]
     */
    async getTargetName(exerciseNo: number): Promise<string[]> {
        const targetList = await this.exerciseTargetRepo.find({ where: { exerciseNo: exerciseNo } });
        const targetNames = await Promise.all(targetList.map(async (target) => {
            const targetEntity = await this.targetRepo.findOne({ where: { no: target.targetNo } });
            return targetEntity.name.toString();
        }));
        return targetNames;
    }
}