import { UserExerciseResponse, UserExerciseSortByDateResponse } from "src/app/exercise/dto/response.dto";
import { ResponseMessage } from "src/common/response/response";
import { EUser } from "../../db/entity/user.entity";
import { ExtraUserInfo } from "../../dto/request/signin.dto";

export interface IUserService {
    /**
     * @summary 유저 정보
     * @param snsNo 
     * @param userId 
     */
    getUserInfo(snsNo: string, userId: string): Promise<EUser>;

    /**
     * @summary 유저 권한 조회
     * @description 있으면 role: string 반환
     * @param no 
     */
    getUserRole(no: number): Promise<string>;

    /**
     * @summary 유저 정보 저장
     * @param signUpUserDto 
     */
    saveUserInfo(signUpUserDto: ExtraUserInfo): Promise<EUser>;

    /**
     * @summary refreshToken 일치 여부 확인
     * @param snsNo 
     * @param userId 
     * @param refreshToken 
     */
    matchRefreshToken(snsNo: string, userId: string, refreshToken: string): Promise<void>;

    /**
     * @summary refreshToken 업데이트
     * @param no 
     * @param snsNo 
     * @param userId 
     * @param refreshToken 
     */
    updateRefresToken(no: number, snsNo: string, userId: string, refreshToken: string): Promise<void>;

    /**
     * @summary 해당 날짜의 운동 기록 가져오기
     * @param no 
     * @param date 
     */
    getMyExercise(no: number, date: string): Promise<UserExerciseResponse[]>;

    /**
     * @summary 내 운동 기록 가져오기
     * @param no 
     */
    getMyExercises(no: number): Promise<UserExerciseSortByDateResponse[]>;


    /**
     * @summary 운동기록 row 삭제
     * @description isRow: true -> row 삭제, false -> exerciseNo에 대한 모든 row 삭제
     * @param exerciseNo 
     */
    deleteMyExercise(userNo: number, exerciseNo: number, isRow: boolean): Promise<ResponseMessage>;
}