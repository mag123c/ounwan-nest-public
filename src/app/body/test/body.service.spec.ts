import { Test, TestingModule } from '@nestjs/testing';
import { BodyServiceImpl } from '../service/core/bodyImpl.service';

describe('BodyService', () => {
  let service: BodyServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BodyServiceImpl],
    }).compile();

    service = module.get<BodyServiceImpl>(BodyServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
