import { winstonLogger } from "./winston";

/**
 * @description Logger for API (body)
 * @param method 메소드나 동작행위
 * @param data 로깅할 데이터
 */
export const bodyLogger = (method: string, data: any) => {
    switch (method) {
        case 'save':
        case 'update':
            bodySaveLogger(method, data);
            break;
        case 'error':
            winstonLogger.error(data);
            break;
    }
}

const bodySaveLogger = (method: string, data: any) => {
    const message = method == 'save' ? `[Body] 저장 완료(${data.userId})` : `[Body] 수정 완료(${data.userId})`;
    winstonLogger.log(`${message}:: ${JSON.stringify(data)}`);
}





export const userLogger = (method: string, data: any) => {
    switch (method) {
        case 'signup':
            signUpLogger(data);
            break;
        case 'error':
            winstonLogger.error(data);
            break;
    }
}

const signUpLogger = (data: any) => {
    const message = `[User] 회원가입 완료(${data.userId})`;
    winstonLogger.log(`${message}:: ${JSON.stringify(data)}`);
}






export const exerciseLogger = (method: string, data: any) => {
    switch (method) {
        case 'favorite':
        case 'selected':
            patchExerciseLogger(method, data);
            break;
        case 'record':
            recordDoneExerciseLogger(data);
            break;
        case 'delete':
            deleteExerciseLogger(data);
            break;
        case 'error':
            winstonLogger.error(data);
            break;
    }
}

const patchExerciseLogger = (method: string, data: any) => {
    const message = method == 'favorite' ? `[Exercise] 즐겨찾기 변경(${data.userNo, data.exerciseNo, data.favorite})`
        : `[Exercise] (${data.exerciseNo})의 선택횟수 증가`;
    winstonLogger.log(message);
}

const recordDoneExerciseLogger = (data: any) => {
    const message = `[Exercise] 운동 기록(${data})`;
    winstonLogger.log(message);
}

const deleteExerciseLogger = (data: any) => {
    const message = `${data}`;
    winstonLogger.log(message);
}