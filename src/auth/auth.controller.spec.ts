import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '@app/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { SignInDtao } from './dtao/auth-signin.input';
import { SignUpDtao } from './dtao/auth-signup.input';
import { User } from '@app/users/user.schema';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('signIn', () => {
    it('should return a JWT token if user is validated', async () => {
      const signInData: SignInDtao = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = { id: 1, email: signInData.email, username: 'johndoe' };
      const mockToken = { accessToken: 'mockToken' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'login').mockResolvedValue(mockToken as any);

      const result = await authController.signIn(signInData);

      expect(authService.validateUser).toHaveBeenCalledWith(
        signInData.email,
        signInData.password,
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException if user is not validated', async () => {
      const signInData: SignInDtao = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authController.signIn(signInData)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authController.signIn(signInData)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });

  describe('register', () => {
    it('should register a new user and return the user data', async () => {
      const signUpData: SignUpDtao = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
      };
      const mockUser = {
        id: 2,
        email: signUpData.email,
        username: signUpData.username,
      };

      jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValue(mockUser as User);

      const result = await authController.register(signUpData);

      expect(usersService.createUser).toHaveBeenCalledWith(
        signUpData.email,
        signUpData.username,
        signUpData.password,
      );
      expect(result).toEqual(mockUser);
    });

    it('should handle validation errors for registration', async () => {
      const signUpData: SignUpDtao = {
        email: '',
        password: 'short',
        username: '',
      };

      jest.spyOn(usersService, 'createUser').mockImplementation(() => {
        throw new Error('Validation error');
      });

      await expect(authController.register(signUpData)).resolves.toEqual({
        message: 'Validation error',
      });
    });
  });
});
