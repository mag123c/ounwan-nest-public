import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthService } from "src/app/auth/decorator/auth.service";
import { DuplicateNickname } from "src/common/error/domain/user";
import { EUserErrorMessage } from "src/common/error/enum/message";
import { MockRepository } from "src/common/util/test/mock-repository.factory";
import { EUser } from "../db/entity/user.entity";
import { UserServiceImpl } from "../service/core/userImpl.service";

describe('UserService', () => {
    let userService: UserServiceImpl;
    let mockUserRepository: MockRepository<EUser>;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserServiceImpl, AuthService, JwtService, ConfigService,
                {
                    provide: getRepositoryToken(EUser),
                    useValue: mockUserRepository
                },
            ],
        }).compile();

        userService = module.get<UserServiceImpl>(UserServiceImpl);
    });

    it('should be defined', () => {
        expect(userService).toBeDefined();
    });

    it('getUserInfo', async () => {
        //given
        const user = new EUser();
        user.userId = 'test1';
        user.nickname = 'test1';

        const compareUser = new EUser();
        compareUser.userId = 'test1';
        compareUser.nickname = 'test1';

        jest.spyOn(userService, 'getUserInfo').mockReturnValue(Promise.resolve(user));

        // when
        const result = await userService.getUserInfo('314cdac31', 'test1');

        // then
        expect(result).toEqual(user);
    });

    it('saveUserInfo', async () => {
        //given
        const saveUser = new EUser();
        saveUser.userId = 'test';
        saveUser.nickname = 'testtest';
        saveUser.sex = 1;
        saveUser.year = 1995;
        saveUser.height = 180;
        saveUser.weight = 90;
        saveUser.snsType = 1;
        saveUser.snsNo = '1234567890';

        //when
        jest.spyOn(userService, 'signUp').mockResolvedValue({ accessToken: '', refreshToken: '', status: 201 });
        const result = await userService.signUp(saveUser);

        //then
        expect(result.status).toEqual(201);
    });

    it('saveUserInfo should throw an error when nickname already exists', async () => {
        //given
        const existsUser = new EUser();
        existsUser.userId = 'test';
        existsUser.nickname = 'testtest';
        existsUser.sex = 1;
        existsUser.year = 1995;
        existsUser.height = 180;
        existsUser.weight = 90;
        existsUser.snsType = 1;
        existsUser.snsNo = '1234567890';

        jest.spyOn(userService, 'signUp').mockRejectedValue(new DuplicateNickname());

        //when then
        await expect(userService.signUp(existsUser)).rejects.toThrow(EUserErrorMessage.DUPLICATE_NICKANME);
    });

});