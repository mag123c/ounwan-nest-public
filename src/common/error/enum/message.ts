export enum EUserErrorMessage {
    NOT_FOUND_USER = '존재하지 않는 회원입니다.',
    DUPLICATE_NICKANME = '중복된 닉네임이 존재합니다.',
    DUPLICATE_USERID = '중복된 아이디가 존재합니다.',
    INCORRECT_PASSWORD = '아이디 혹은 비밀번호가 일치하지 않습니다.',
    INCORRECT_ACCESS_TOKEN = 'Unauthorized Something - 1',
    INCORRECT_REFRESH_TOKEN = 'Unauthorized Something - 2',
    ISNOT_ADMIN = 'Unauthorized Something - 3',
    UNSUPPORTED_TYPE = "UNSUPPORTED_TYPE"
}

export enum EFileErrorMessage {
    UNSUPPORTED_TYPE = '지원하지 않는 타입입니다.',
    UNSUPPORTED_SIZE = '파일의 용량이 너무 큽니다.',
    EXISTS_FILE = '파일이 이미 존재합니다.',
    NOT_FOUND_FILE = "파일이 존재하지 않습니다.",
}

export enum EExerciseErrorMessage {
    TARGET_NOT_FOUND = '존재하지 않는 타겟입니다.',
    FAVORITE_CHANGE_FAIL = '좋아요 변경 실패',
    UPSERT_DAILY_EXERCISE_FAIL = '운동 기록 실패',
}