import { CustomHttpException } from "../custom.error";
import { EExerciseErrorMessage } from "../enum/message";

export class TargetNotFound extends CustomHttpException {
    constructor() {
        super(404, 300, EExerciseErrorMessage.TARGET_NOT_FOUND);
    }
}

export class FavoriteExerciseChangeFail extends CustomHttpException {
    constructor(sql?: string, sqlMessage?: string) {
        super(500, 300, EExerciseErrorMessage.FAVORITE_CHANGE_FAIL, sql, sqlMessage);
    }
}

export class UpsertDailyExerciseFail extends CustomHttpException {
    constructor(sql?: string, sqlMessage?: string) {
        super(500, 301, EExerciseErrorMessage.UPSERT_DAILY_EXERCISE_FAIL, sql, sqlMessage);
    }
}