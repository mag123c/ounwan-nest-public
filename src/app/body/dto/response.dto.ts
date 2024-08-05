import { EBodyInfo } from "../db/entity/bodyinfo.entity";

/**
 * getBodyInfo 리턴객체
 * @fields bodyInfos
 * 사용자의 기록된 모든 바디 정보
 * @Fields recentInfo
 * 사용자의 가장 최근 바디 정보
 */
export class BodyInfo {
    bodyInfos: EBodyInfo[];
    recentInfo: RecentBodyInfo;
};

/**
 * BodyInfos에서의 가장 최근 정보
 * @fields height, weight, fat, muscleMass
 */
export class RecentBodyInfo {
    height: string;
    weight: string;
    fat: string;
    muscleMass: string;    

    /**
     * 필드들이 모두 존재하는지 확인
     * @returns 
     * boolean
     */
    isAll(): boolean {
        return this.height && this.weight && this.fat && this.muscleMass ? true : false;
    }
}

/**
 * RecentBodyInfo 타입
 * @fields height, weight, fat, muscleMass
 */
export class TRecentBodyInfo {
    height: string;
    weight: string;
    fat: string;
    muscleMass: string;    
}