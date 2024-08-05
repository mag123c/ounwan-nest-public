import { EUser } from "src/app/user/db/entity/user.entity";
import { PostResponse } from "src/common/response/response";
import { EBodyInfo } from "../../db/entity/bodyinfo.entity";
import { ChangeBodyInfo, SaveBodyInfoDto } from "../../dto/request.dto";
import { BodyInfo } from "../../dto/response.dto";

export interface IBodyService {

    /**
     * @description 사용자의 바디 정보를 가져온다.
     * @param no User entity PK
     * @returns BodyInfo
     */
    getBodyInfo(no: number, period: string): Promise<BodyInfo>;

    /**
     * @description 사용자의 바디 정보를 저장한다.
     * @param user 유저 JWT decode 정보
     * @param bodyInfo 저장을 위한 Request DTO
     */
    saveBodyInfo(user: EUser, bodyInfo: SaveBodyInfoDto): Promise<PostResponse<EBodyInfo>>;   

    putBodyInfo(user: EUser, bodyInfo: ChangeBodyInfo): Promise<PostResponse<EBodyInfo[]>>;

    deleteBodyInfo(user: EUser, no: number): Promise<PostResponse<EBodyInfo[]>>;
}