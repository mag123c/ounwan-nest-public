import { MockRepository, MockRepositoryFactory } from "src/common/util/test/mock-repository.factory";
import { EUser } from "../db/entity/user.entity";
import { UserRepository } from "../db/repository/user.repository";

describe('UserRepository', () => {
  let userRepository: MockRepository<UserRepository>;  

  beforeEach(() => {
    userRepository = MockRepositoryFactory.getMockRepository(UserRepository);
  });

  it('should find user by user id', async () => {
    // Given
    const user = new EUser();
    user.snsNo = 'testtesttest1'
    user.userId = 'test1';
    user.nickname = 'test1';

    const compareUser = new EUser();
    compareUser.snsNo = 'testtesttest1'
    compareUser.userId = 'test1';
    compareUser.nickname = 'test1';

    jest.spyOn(userRepository, 'findBySnsNoAndUserId').mockReturnValue(user);

    // When
    const result = await userRepository.findBySnsNoAndUserId(compareUser.snsNo, compareUser.userId);

    // Then
    expect(result).toEqual(user);    
  });
});