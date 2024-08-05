import { Module } from '@nestjs/common';
import { ExerciseRepository } from '../exercise/db/repository/exercise.repository';
import { UserExerciseRepository } from '../exercise/db/repository/user-exercise.repository';
import { UserExerciseService } from '../exercise/service/support/user-exercise.service';
import { UserRoleRepository } from './db/repository/role.repository';
import { UserRepository } from './db/repository/user.repository';
import { UserServiceImpl } from './service/core/userImpl.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'UserService',
      useClass: UserServiceImpl,
    },
    UserExerciseService,
    UserRepository,
    UserRoleRepository,
    UserExerciseRepository,
    ExerciseRepository,
  ],
  exports: ['UserService', UserRepository, UserRoleRepository],
})
export class UserModule {}
