import { Injectable } from '@nestjs/common';
import { EUser } from 'src/app/user/db/entity/user.entity';
import { DeteleFail, UpdateFail } from 'src/common/error/domain/database';
import { bodyLogger } from 'src/common/logger/api.logger';
import { PostResponse } from 'src/common/response/response';
import { extractToYmd, subtractMonth, subtractYear } from 'src/common/util/time.util';
import { EBodyInfo } from '../../db/entity/bodyinfo.entity';
import { BodyInfoRepository } from '../../db/repository/bodyinfo.repository';
import { ChangeBodyInfo, SaveBodyInfoDto } from '../../dto/request.dto';
import { BodyInfo, RecentBodyInfo } from '../../dto/response.dto';
import { EPeriod } from '../../enum/body.enum';
import { IBodyService } from './bodyITF.service';

@Injectable()
export class BodyServiceImpl implements IBodyService {

    constructor(private bodyInfoRepository: BodyInfoRepository) { }

    async getBodyInfo(no: number, period: string): Promise<BodyInfo> {
        let bodyInfos: EBodyInfo[] = await this.bodyInfoRepository.findBodyInfo(no);
        const recentInfo: RecentBodyInfo = new RecentBodyInfo();

        bodyInfos.forEach((info) => {
            if (recentInfo.isAll()) return;

            if (!recentInfo.weight && info.weight) {
                recentInfo.weight = info.weight;
            }
            if (!recentInfo.height && info.height) {
                recentInfo.height = info.height;
            }
            if (!recentInfo.fat && info.fat) {
                recentInfo.fat = info.fat;
            }
            if (!recentInfo.muscleMass && info.muscleMass) {
                recentInfo.muscleMass = info.muscleMass;
            }
        });

        const calPeriod = this.calPeriod(period);

        if (calPeriod) {
            bodyInfos = bodyInfos.filter((info) => {
                return extractToYmd(info.createdAt) >= calPeriod;
            });
        }

        return {
            bodyInfos,
            recentInfo
        }
    }

    async saveBodyInfo(user: EUser, bodyInfo: SaveBodyInfoDto): Promise<PostResponse<EBodyInfo>> {
        try {
            const existsNo = await this.isDuplicateBodyInfo(user.no, bodyInfo.createdAt);

            if (existsNo) {
                const bodyInfoEntity = new EBodyInfo().build(user.no, bodyInfo);
                await this.bodyInfoRepository.updateBodyInfo(existsNo, bodyInfoEntity);
                bodyLogger('update', bodyInfoEntity);
                return new PostResponse<EBodyInfo>(200, 'Update Body Info Success', bodyInfoEntity);
            }

            else {
                const bodyInfoEntity = new EBodyInfo().build(user.no, bodyInfo);
                await this.bodyInfoRepository.saveBodyInfo(bodyInfoEntity);
                bodyLogger('save', bodyInfoEntity);
                return new PostResponse<EBodyInfo>(201, 'Save Body Info Success', bodyInfoEntity);
            }
        }
        catch (e) {
            bodyLogger('error', `[Body] 신체 정보 저장 실패(${user.userId}): ${e}`);
            throw e;
        }

    }

    async putBodyInfo(user: EUser, bodyInfo: ChangeBodyInfo): Promise<PostResponse<EBodyInfo[]>> {
        try {
            return await this.bodyInfoRepository.update(bodyInfo.no, {
                weight: bodyInfo.weight,
                height: bodyInfo.height,
                muscleMass: bodyInfo.muscleMass,
                fat: bodyInfo.fat,
            })
                .then(async () => {                    
                    return {
                        status: 200,
                        message: 'success',
                        data: (await this.getBodyInfo(user.no, "전체기간")).bodyInfos,
                    }
                })
                .catch((e) => {
                    console.error(e);
                    throw new UpdateFail(e.code, e.sql, e.sqlMessage)
                })
        }
        catch (e) {
            console.error(e);
            bodyLogger('error', `[Body] 신체 정보 변경 실패(${user.userId}): ${e}`);
            throw e;
        }
    }
    async deleteBodyInfo(user: EUser, no: number): Promise<PostResponse<EBodyInfo[]>> {
        try {
            return await this.bodyInfoRepository.delete(no)
                .then(async () => {
                    return {
                        status: 200,
                        message: 'success',
                        data: (await this.getBodyInfo(user.no, "전체기간")).bodyInfos,
                    }
                })
                .catch((e) => {
                    throw new DeteleFail(e.code, e.sql, e.sqlMessage)
                });
        }
        catch (e) {
            bodyLogger('error', `[Body] 신체 정보 삭제 실패(${user.userId}/${no}): ${e}`);
        }
    }

    /**
     * @summary 중복된 바디 정보가 있는지 확인
     * @description 중복된 바디 정보가 있으면 해당 바디 정보의 PK를 반환, update로 활용
     * @param userNo 
     * @param createdAt 
     * @returns exists PK | undefined
     */
    private async isDuplicateBodyInfo(userNo: number, createdAt: Date): Promise<number> {
        const exists = await this.bodyInfoRepository.findByCreatedAt(userNo, createdAt);

        return exists ? exists.no : undefined;
    }


    /**
     * EPeriod의 값 별로 YYYY-MM-DD 계산
     * @param period 
     * @returns 
     */
    private calPeriod(period: string): string {
        switch (period as EPeriod) {
            case EPeriod.LAST_30_DAYS:
                return subtractMonth(1);
            case EPeriod.LAST_90_DAYS:
                return subtractMonth(3);
            case EPeriod.LAST_YEAR:
                return subtractYear(1);
            default:
                return null;
        }
    }
}
