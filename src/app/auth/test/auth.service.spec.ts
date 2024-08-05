import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../decorator/auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const jwtServiceMock = {
      sign: jest.fn().mockReturnValue('mockedToken'),
    };

    const configServiceMock = {
      get: jest.fn().mockReturnValue('1d'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createToken', async () => {
    const socialUser = {   
      no: 123456789,   
      userId: '95jjh@naver.com',      
    };

    const result = service.createToken(socialUser);

    expect(result).toBeDefined();
    expect(jwtService.sign).toHaveBeenCalledTimes(2);
  });
});
