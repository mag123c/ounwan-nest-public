import { Test, TestingModule } from '@nestjs/testing';
import { BodyController } from '../body.controller';

describe('BodyController', () => {
  let controller: BodyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BodyController],
    }).compile();

    controller = module.get<BodyController>(BodyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
