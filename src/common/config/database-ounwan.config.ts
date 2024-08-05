import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { EBodyInfo } from "src/app/body/db/entity/bodyinfo.entity";
import { EExerciseTarget } from "src/app/exercise/db/entity/exercise-target.entity";
import { EExercise } from "src/app/exercise/db/entity/exercise.entity";
import { ERoutineDetail } from "src/app/exercise/db/entity/routine-detail.entity";
import { ETarget } from "src/app/exercise/db/entity/target.entity";
import { EUserExercise } from "src/app/exercise/db/entity/user-exercise.entity";
import { EUserExerciseLike } from "src/app/exercise/db/entity/user-like.entity";
import { EUserRoutine } from "src/app/exercise/db/entity/user-routine.entity";
import { EUserRole } from "src/app/user/db/entity/role.entity";
import { EUser } from "src/app/user/db/entity/user.entity";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { MyEventSubscriber } from "./database-event.subscriber";


export const OunwanConnection = (configService: ConfigService) => (
    {
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        dateStrings: true,
        charset: 'utf8mb4',
        collation: 'utf8mb4_general_ci',
        entities: [
            //user
            EUser,            
            EUserRole,

            //RDB
            EUserExercise,
            EBodyInfo,
            EUserRoutine,
            ERoutineDetail,
            EExerciseTarget,
            EUserExerciseLike,

            //exercise
            EExercise,
            ETarget,     
        ],
        logging: process.env.NODE_ENV === 'dev' ? true : false,
        syncronize: false,
        namingStrategy: new SnakeNamingStrategy(),
        cli: [
            
        ],
        subscribers: [MyEventSubscriber],
    } as TypeOrmModuleAsyncOptions 
);