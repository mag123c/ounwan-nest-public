import { ResponseMessage } from "src/common/response/response";
import { AdminExercise, DoneExercise } from "../../dto/request.dto";

export interface IExerciseService {

    /**
     * @description 운동정보 포맷팅해서 반환
     * @param userNo 
     */
    getExerciseList(userNo: number): Promise<any>;

    /**
     * @summary 관리자용 운동 등록
     * @param path 
     * @param name 
     * @param targets 
     */
    createExercise(path: string, name: string, targets: string): void;

    /**
     * @summary 관리자용 운동 수정
     * @description
     * 1. 이미지 파일 삭제
     * 2. 운동타겟 일괄 삭제
     * 3. 운동정보 수정
     * @param filename 
     * @param exerciseNo
     * @param name
     * @param targets
     */
    modifyExercise(filename: string, exercise: AdminExercise): void;

    /**
     * @summary 관리자용 운동 삭제 (row data, image file 삭제)
     * @description FK cascade가 되어있기 때문에 target, user_exercise, user_exercise_like등등 관계에 대한 삭제는 자동으로 처리됨
     * 1. 이미지삭제
     * 2. row 삭제
     * @param no 
     */
    deleteExercise(no: number, imagePath: string): Promise<void>;

    /**
     * @description 유저의 운동 즐겨찾기 변경
     * @param userNo 
     * @param exerciseNo 
     */
    changeExerciseFavorite(userNo: number, exerciseNo: number): Promise<ResponseMessage>;

    /**
     * @summary 수행한 운동 등록
     * @description 해당 일자의 수행 운동 등록
     * 1. user_exercise:: insert / update
     * 2. user:: last_workout update
     * 3. exercise:: select_cnt update
     * @param no 
     * @param date 
     * @param doneExerciseDto 
     */
    recordDoneExercise(no: any, date: string, doneExerciseDto: DoneExercise[]): Promise<ResponseMessage>;

    /**
     * @summary 운동 이미지 경로 반환
     * @param no 
     */
    getImagePath(no: number): Promise<string>;

}
