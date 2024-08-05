import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { UserModule } from '../user/user.module';
import { UserExerciseLikeRepository } from './db/repository/exercise-like.repository';
import { ExerciseTargetRepository } from './db/repository/exercise-target.repository';
import { ExerciseRepository } from './db/repository/exercise.repository';
import { TargetRepository } from './db/repository/target.repository';
import { UserExerciseRepository } from './db/repository/user-exercise.repository';
import { ExerciseController } from './exercise.controller';
import { ExerciseServiceImpl } from './service/core/exerciseImpl.service';
import { ExerciseTargetService } from './service/support/exercise-target.service';
import { TargetService } from './service/support/target.service';
import { UserExerciseLikeService } from './service/support/user-exercise-like.service';
import { UserExerciseService } from './service/support/user-exercise.service';
import { TargetController } from './target.controller';

@Module({
  imports: [FileModule, UserModule],
  controllers: [
    ExerciseController,
    TargetController,
  ],
  providers: [
    {
      provide: 'ExerciseService',
      useClass: ExerciseServiceImpl
    },
    ExerciseTargetService,
    TargetService,
    UserExerciseService,
    UserExerciseLikeService,
    
    ExerciseRepository,
    ExerciseTargetRepository,
    TargetRepository,        
    UserExerciseRepository,
    UserExerciseLikeRepository,
  ]
})
export class ExerciseModule {}
