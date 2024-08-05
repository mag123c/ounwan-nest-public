export class ExerciseResponse {
    no: number;
    name: string;
    path: string;
    targets: string[];
    selectCnt: number;
    favoriteCnt: number;
    favorite: boolean;
}

/**
 * @summary 운동별 그룹화된 객체
 * @description Daily User Exercise Response
 */
export class UserExerciseResponse {
    exerciseNo: number;
    userExerciseNo: number;
    exerciseName: string;
    sets?: TSet[];
    time?: number;
    memo?: string;
    createdAt?: Date;
    url: string;

    constructor(exerciseNo: number, userExerciseNo: number, exerciseName: string, createdAt: Date, url: string, sets?: TSet[], time?: number, memo?: string) {
        this.exerciseNo = exerciseNo;
        this.userExerciseNo = userExerciseNo;
        this.exerciseName = exerciseName;
        this.createdAt = createdAt;
        this.url = url;

        this.sets = sets;
        this.time = time;
        this.memo = memo;
    }
}

/**
 * @summary 날짜별, 운동별 그룹화된 객체
 * @description Whole User Exercise Response
 */
export class UserExerciseSortByDateResponse {
    date: string;
    userExercise: UserExerciseResponse[];

    constructor(date: string, userExercise: UserExerciseResponse[]) {
        this.date = date;
        this.userExercise = userExercise;
    }

}

type TSet = {
    reps?: number;
    weight?: number;
}