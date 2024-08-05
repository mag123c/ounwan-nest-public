import { Test, TestingModule } from "@nestjs/testing";
import { MockService } from "src/common/util/test/mock-service.factory";
import { UserServiceImpl } from "../service/core/userImpl.service";
import { UserController } from "../user.controller";

let mockUserService: MockService<UserServiceImpl>;

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'UserService',
          useValue: mockUserService,
        },
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
