import { Injectable } from "@nestjs/common";
import { InsertFail, SelectFail, UpdateFail } from "src/common/error/domain/database";
import { DataSource, Repository } from "typeorm";
import { TRecentBodyInfo } from "../../dto/response.dto";
import { EBodyInfo } from "../entity/bodyinfo.entity";

@Injectable()
export class BodyInfoRepository extends Repository<EBodyInfo>{

    constructor(private dataSource: DataSource) {
        super(EBodyInfo, dataSource.createEntityManager());
    }

    /**
     * @summary - 사용자의 바디 정보를 가져온다.
     * @description - where: user, order: createdAt DESC
     * @param no - PK
     * @returns - 엔터티 (EBodyInfo[])
     */
    async findBodyInfo(no: number): Promise<EBodyInfo[]> {
        try {
            return await this.find(
                {
                    where: { userNo: no },
                    order: { createdAt: 'DESC' }
                }
            );
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage);
        }
    }

    async findMostRecentBodyInfo(no: number): Promise<TRecentBodyInfo> {
        try {
            const query = this.createQueryBuilder('bodyInfo')
                .where('bodyInfo.userNo = :no', { no })
                .orderBy('bodyInfo.createdAt', 'DESC')
                .take(1);

            const height = await query.select('bodyInfo.height').getOne();
            const weight = await query.select('bodyInfo.weight').getOne();
            const fat = await query.select('bodyInfo.fat').getOne();
            const muscleMass = await query.select('bodyInfo.muscleMass').getOne();

            return {
                height: height?.height,
                weight: weight?.weight,
                fat: fat?.fat,
                muscleMass: muscleMass?.muscleMass
            }
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage);
        }
    }

    /**
     * @summary 바디정보 저장
     * @param bodyInfoEntity 
     */
    async saveBodyInfo(bodyInfoEntity: EBodyInfo): Promise<void> {
        try {
            await this.createQueryBuilder()
                .insert()
                .into(EBodyInfo)
                .values(bodyInfoEntity)
                .execute();
        }
        catch (e) {
            throw new InsertFail(e.code, e.sql, e.sqlMessage);
        }
    }

    async findByCreatedAt(userNo: number, createdAt: Date): Promise<EBodyInfo> {
        try {
            return await this.createQueryBuilder('bodyInfo')
                .where('bodyInfo.userNo = :userNo', { userNo })
                .andWhere('bodyInfo.createdAt = :createdAt', { createdAt })
                .getOne();
        }
        catch (e) {
            throw new SelectFail(e.code, e.sql, e.sqlMessage);
        }
    }


    /**
     * @summary PK로 바디정보 업데이트
     * @param existsNo 
     * @param bodyInfoEntity 
     */
    async updateBodyInfo(existsNo: number, bodyInfoEntity: EBodyInfo): Promise<void>{
        try {
            const updateResult = await this.createQueryBuilder()
                .update(EBodyInfo)
                .set(bodyInfoEntity)
                .where('no = :no', { no: existsNo })
                .execute();

            if (updateResult.affected === 0) {
                throw new Error('BodyInfo Update Fail');
            }
        }
        catch (e) {
            throw new UpdateFail(e.code, e.sql, e.sqlMessage);
        }
    }



}