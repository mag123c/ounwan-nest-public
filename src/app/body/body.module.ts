import { Module } from '@nestjs/common';
import { BodyController } from './body.controller';
import { BodyInfoRepository } from './db/repository/bodyinfo.repository';
import { BodyServiceImpl } from './service/core/bodyImpl.service';

@Module({
  providers: [
    {
      provide: 'BodyService',
      useClass: BodyServiceImpl,
    },
    BodyInfoRepository,
  ],
  controllers: [BodyController]
})
export class BodyModule {}
