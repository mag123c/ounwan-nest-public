import { Injectable } from '@nestjs/common';
import {
  UserExerciseResponse,
  UserExerciseSortByDateResponse,
} from 'src/app/exercise/dto/response.dto';
import { UserExerciseService } from 'src/app/exercise/service/support/user-exercise.service';
import { InsertFail } from 'src/common/error/domain/database';
import { exerciseLogger } from 'src/common/logger/api.logger';
import { ResponseMessage } from 'src/common/response/response';
import { EUser } from '../../db/entity/user.entity';
import { UserRoleRepository } from '../../db/repository/role.repository';
import { UserRepository } from '../../db/repository/user.repository';
import { ExtraUserInfo } from '../../dto/request/signin.dto';
import { isMatches401 } from '../../util/validate';
import { IUserService } from './user.service';

@Injectable()
export class UserServiceImpl implements IUserService {
  constructor(
    private readonly userExerciseService: UserExerciseService,

    private userRepo: UserRepository,
    private roleRepo: UserRoleRepository,
  ) {}

  async getUserInfo(snsNo: string, userId: string): Promise<EUser> {
    return await this.userRepo.findBySnsNoAndUserId(snsNo, userId);
  }

  async getUserRole(no: number): Promise<string> {
    return await this.roleRepo
      .findOne({ where: { userNo: no } })
      .then((role) => role?.role);
  }

  async saveUserInfo(signUpUserDto: ExtraUserInfo): Promise<EUser> {
    try {
      const user = new EUser().dtoToEntity(signUpUserDto);
      return await this.userRepo.save(user);
    } catch (e: any) {
      throw new InsertFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async matchRefreshToken(
    snsNo: string,
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const existUser = await this.getUserInfo(snsNo, userId);
    isMatches401(existUser.refreshToken, refreshToken);
  }

  async updateRefresToken(
    no: number,
    snsNo: string,
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepo.updateRefreshToken(snsNo, userId, refreshToken);
  }

  async getMyExercise(
    no: number,
    date: string,
  ): Promise<UserExerciseResponse[]> {
    return await this.userExerciseService.getMyExercise(no, date);
  }

  async getMyExercises(no: number): Promise<UserExerciseSortByDateResponse[]> {
    return await this.userExerciseService.getMyExercises(no);
  }

  async deleteMyExercise(
    userNo: number,
    exerciseNo: number,
    isRow: boolean,
  ): Promise<ResponseMessage> {
    let promise;
    if (isRow) {
      promise = this.userExerciseService.deleteMyExerciseRow(exerciseNo);
    } else {
      promise = this.userExerciseService.deleteMyExercise(userNo, exerciseNo);
    }

    return await promise
      .then(() => new ResponseMessage(200, 'success'))
      .catch((e) => {
        exerciseLogger('error', `[Exercise] 운동 기록 삭제 실패: ${e}`);
        return new ResponseMessage(500, e.message);
      });
  }
}
