import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { EUserRole } from '../entity/role.entity';

@Injectable()
export class UserRoleRepository extends Repository<EUserRole> {
  constructor(private dataSource: DataSource) {
    super(EUserRole, dataSource.createEntityManager());
  }
}
