import { Injectable } from '@nestjs/common';
import { SelectFail } from 'src/common/error/domain/database';
import { DataSource, Repository } from 'typeorm';
import { EUser } from '../entity/user.entity';

@Injectable()
export class UserRepository extends Repository<EUser> {
  constructor(private dataSource: DataSource) {
    super(EUser, dataSource.createEntityManager());
  }

  async findBySnsNoAndUserId(snsNo: string, userId: string): Promise<EUser> {
    try {
      return await this.createQueryBuilder('user')
        .where('user.snsNo = :snsNo', { snsNo })
        .andWhere('user.userId = :userId', { userId })
        .getOne();
    } catch (e: any) {
      throw new SelectFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async findByNickname(nickname: string): Promise<EUser> {
    try {
      return await this.createQueryBuilder('user')
        .where('user.nickname = :nickname', { nickname })
        .getOne();
    } catch (e: any) {
      throw new SelectFail(e.code, e.sql, e.sqlMessage);
    }
  }

  async updateRefreshToken(
    snsNo: string,
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await this.createQueryBuilder()
        .update(EUser)
        .set({ refreshToken })
        .where('snsNo = :snsNo', { snsNo })
        .andWhere('userId = :userId', { userId })
        .execute();
    } catch (e: any) {
      throw new SelectFail(e.code, e.sql, e.sqlMessage);
    }
  }
}
