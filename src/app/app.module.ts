import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { OunwanConnection } from 'src/common/config/database-ounwan.config';
import { LoggerMiddleware } from 'src/common/logger/logger.middleware';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BodyModule } from './body/body.module';
import { ExerciseModule } from './exercise/exercise.module';
import { FileModule } from './file/file.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: OunwanConnection,
      async dataSourceFactory(option) {
        if (!option) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource({
          //병렬 사용가능
          name: 'ounwanDataSource',
          dataSource: new DataSource(option),
        });
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,      
      envFilePath: getEnvFileName(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'static'),
      exclude: ['/api*', '/health'],
    }),
    UserModule,
    AuthModule,
    BodyModule,
    ExerciseModule,
    FileModule,
  ],
  controllers: [AppController], 
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

function getEnvFileName() {
  return process.env.NODE_ENV == 'dev'
    ? '.env.dev'
    : process.env.NODE_ENV == 'staging'
    ? '.env.staging'
    : process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'local'
    ? '.env.local'
    : '.env.test';
}