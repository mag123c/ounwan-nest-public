import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/app/user/db/repository/user.repository';
import {
  InsertFail,
  SelectFail,
  UpdateFail,
} from 'src/common/error/domain/database';
import { extractToYmd } from 'src/common/util/time.util';
import { EUserExercise } from '../../db/entity/user-exercise.entity';
import { ExerciseRepository } from '../../db/repository/exercise.repository';
import { UserExerciseRepository } from '../../db/repository/user-exercise.repository';
import { DoneExercise } from '../../dto/request.dto';
import {
  UserExerciseResponse,
  UserExerciseSortByDateResponse,
} from '../../dto/response.dto';

@Injectable()
export class UserExerciseService {
  constructor(
    private exerciseRepo: ExerciseRepository,
    private userExerciseRepo: UserExerciseRepository,
    private userRepo: UserRepository,
  ) {}

  /**
   * @summary 일일 운동 기록 업데이트
   * @description 이전, 이후 날짜에대한 기록 포함하여 범용적으로 사용 가능
   * @param userNo
   * @param date
   * @param doneExercise
   * @returns boolean (true: insert, false: update)
   */
  async upsertDailyExercise(
    userNo: number,
    date: Date,
    done: DoneExercise,
  ): Promise<boolean> {
    try {
      let isInsert = false;
      if (done.isCardio) {
        const exists = await this.findCardioRow(userNo, done.exerciseNo, date);

        if (exists) {
          exists.time = done.time;
          exists.memo = done.memo;
          await this.updateRow(exists);
        } else {
          const rowData: EUserExercise = new EUserExercise().buildCardio(
            userNo,
            done.exerciseNo,
            date,
            done.time,
            done.memo,
          );
          await this.insertRow(rowData);

          isInsert = true;
        }
      } else {
        let sets = 1;
        for (const row of done.strengthSets) {
          const exists = await this.findStrengthRow(
            userNo,
            done.exerciseNo,
            date.toISOString().split('T')[0],
            sets,
          );

          if (exists) {
            exists.reps = row.reps;
            exists.weight = row.weight;
            exists.memo = done.memo;
            await this.updateRow(exists);
          } else {
            const rowData: EUserExercise = new EUserExercise().buildStrength(
              userNo,
              done.exerciseNo,
              sets,
              row.reps,
              row.weight,
              date,
              done.memo,
            );
            await this.insertRow(rowData);

            isInsert = true;
          }

          sets++;
        }
      }

      return isInsert;
    } catch (e) {
      throw e;
    }
  }

  async findCardioRow(
    userNo: number,
    exerciseNo: number,
    date: Date,
  ): Promise<EUserExercise> {
    try {
      return await this.userExerciseRepo.findOne({
        where: { userNo: userNo, exerciseNo: exerciseNo, createdAt: date },
      });
    } catch (e) {
      throw new SelectFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async findStrengthRow(
    userNo: number,
    exerciseNo: number,
    ymdString: string,
    sets: number,
  ): Promise<EUserExercise> {
    try {
      return await this.userExerciseRepo.findOne({
        where: {
          userNo: userNo,
          exerciseNo: exerciseNo,
          createdAt: ymdString,
          sets: sets,
        },
      });
    } catch (e) {
      throw new SelectFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async insertRow(row: EUserExercise): Promise<void> {
    try {
      await this.userExerciseRepo.insert(row);
    } catch (e) {
      throw new InsertFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async updateRow(row: EUserExercise): Promise<void> {
    try {
      await this.userExerciseRepo.update(row.no, row);
    } catch (e) {
      throw new UpdateFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async updateLastWorkout(userNo: number, date: string): Promise<void> {
    // await this.userRepo.update(userNo, { lastWorkout: date })
  }

  async getMyExercise(
    no: number,
    date: string,
  ): Promise<UserExerciseResponse[]> {
    const userExercise: EUserExercise[] =
      await this.userExerciseRepo.findDailyDoneExercise(no, date);
    const exerciseInfo: {
      exerciseNo: number;
      exerciseName: string;
      url: string;
    }[] = await this.findExerciseInfos(userExercise);

    return await this.groupingExerciseByExerciseName(
      userExercise,
      exerciseInfo,
    );
  }

  async getMyExercises(no: number): Promise<UserExerciseSortByDateResponse[]> {
    const userExercises: EUserExercise[] = await this.userExerciseRepo.find({
      where: { userNo: no },
    });
    const exerciseInfo: {
      exerciseNo: number;
      exerciseName: string;
      url: string;
    }[] = await this.findExerciseInfos(userExercises);
    const groupedByNames = await this.groupingExerciseByExerciseName(
      userExercises,
      exerciseInfo,
    );

    return await this.groupingExerciseByDate(groupedByNames);
  }

  /**
   * @summary 운동 기록을 운동 이름으로 그룹화
   * @param userExercise
   * @param exerciseNames
   * @returns
   */
  async groupingExerciseByExerciseName(
    userExercise: EUserExercise[],
    exerciseInfos: { exerciseNo: number; exerciseName: string; url: string }[],
  ): Promise<UserExerciseResponse[]> {
    const response: UserExerciseResponse[] = [];

    userExercise.forEach((exercise, i) => {
      const { exerciseNo, exerciseName, url } = exerciseInfos[i];

      let responseObj = response.find(
        (e) =>
          e.exerciseName === exerciseName &&
          extractToYmd(e.createdAt) == extractToYmd(exercise.createdAt),
      );

      if (!responseObj) {
        responseObj = new UserExerciseResponse(
          exerciseNo,
          exercise.no,
          exerciseName,
          exercise.createdAt,
          url,
          [],
        );
        response.push(responseObj);
      }

      if (exercise.time) {
        responseObj.time = exercise.time;
        responseObj.memo = exercise.memo;
      } else {
        responseObj.sets.push({ reps: exercise.reps, weight: exercise.weight });
        responseObj.memo = exercise.memo;
      }
    });

    return response;
  }

  /**
   * @summary 운동 기록을 날짜별로 그룹화
   * @param userExercises
   * @returns
   */
  async groupingExerciseByDate(
    userExercises: UserExerciseResponse[],
  ): Promise<UserExerciseSortByDateResponse[]> {
    const groupedByDate = {};

    userExercises.forEach((exercise) => {
      const createdAt = exercise.createdAt.toString();

      if (!groupedByDate[createdAt]) {
        groupedByDate[createdAt] = {
          date: createdAt,
          userExercise: [],
        };
      }

      groupedByDate[createdAt].userExercise.push(exercise);
    });

    return Object.values(groupedByDate);
  }

  /**
   * @summary 운동 이름 배열 만들기
   * @description 가져온 UserExercise 객체에서 운동 번호로 운동 이름을 찾아 배열로 반환
   * @param userExercise
   * @returns
   */
  async findExerciseInfos(
    userExercise: EUserExercise[],
  ): Promise<{ exerciseNo: number; exerciseName: string; url: string }[]> {
    return await Promise.all(
      userExercise.map(async (exercise) => {
        const { exerciseNo } = exercise;
        return {
          exerciseNo,
          ...(await this.findExerciseInfo(exerciseNo)),
        };
      }),
    );
  }

  /**
   * @summary 운동 번호로 운동 이름 찾기
   * @param exerciseNo
   * @returns
   */
  async findExerciseInfo(
    exerciseNo: number,
  ): Promise<{ exerciseName: string; url: string }> {
    return await this.exerciseRepo
      .findOne({ where: { no: exerciseNo } })
      .then((data) => {
        const { name, url } = data;
        return {
          exerciseName: name,
          url: url,
        };
      })
      .catch((e) => {
        throw new SelectFail(e.code, e.sql, e.sqlMessage);
      });
  }

  async deleteMyExerciseRow(userExerciseNo: number): Promise<void> {
    await this.userExerciseRepo.delete(userExerciseNo).catch((e) => {
      throw new UpdateFail(e.code, e.sql, e.sqlMessage);
    });
  }

  async deleteMyExercise(userNo: number, exerciseNo: number) {
    await this.userExerciseRepo.delete({ userNo, exerciseNo }).catch((e) => {
      throw new UpdateFail(e.code, e.sql, e.sqlMessage);
    });
  }
}
