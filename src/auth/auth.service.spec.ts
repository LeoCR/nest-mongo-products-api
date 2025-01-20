import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@app/users/users.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('@app/users/users.service');
jest.mock('@nestjs/jwt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should validate user successfully', async () => {
      const email = 'test@example.com';
      const password = 'your_password';
      const mockUser = {
        _id: '1',
        email,
        password:
          '$2b$10$M4gDiK4upQw3aFVj5m7PX.bgjwxJNj4MwNy7vUcO/B.BfL4OgrGuK',
      };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as any);

      // Using the helper function directly
      const result = await authService.validateUser(email, password);
      expect(result).toEqual(mockUser);
    });

    it('should return null if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const mockUser = { _id: '1', email, password: 'hashedPassword' };

      jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser as any);

      const result = await authService.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate JWT token', async () => {
      const mockUser = {
        _id: '1',
        username: 'test',
        email: 'test@example.com',
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('jwtToken');

      const result = await authService.login(mockUser);
      expect(result.access_token).toEqual('jwtToken');
    });
  });
});
