import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { comparePasswords } from '@app/auth/auth.util';

jest.mock('@app/auth/auth.util', () => ({
  comparePasswords: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userModel: Model<User>;

  const mockUserModel = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null); // No user exists
      mockUserModel.create.mockImplementation((data) => ({
        save: jest.fn().mockResolvedValue({ ...data, _id: '123' }),
      }));

      const result = await service.createUser(
        'test@example.com',
        'TestUser',
        'password123',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual({
        email: 'test@example.com',
        username: 'TestUser',
        password: 'password123',
        _id: '123',
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: 'test@example.com' });

      await expect(
        service.createUser('test@example.com', 'TestUser', 'password123'),
      ).resolves.toEqual({ message: 'Email already exists' });
      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('validateUser', () => {
    it('should return true for valid user and password', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword123',
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (comparePasswords as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(comparePasswords).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
      expect(result).toBe(false);
    });

    it('should return false for invalid password', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword123',
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (comparePasswords as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrongPassword',
      );

      expect(comparePasswords).toHaveBeenCalledWith(
        'wrongPassword',
        'hashedPassword123',
      );
      expect(result).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        email: 'test@example.com',
        username: 'TestUser',
      };
      mockUserModel.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('test@example.com');

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual(mockUser);
    });

    it('should handle errors and return null', async () => {
      mockUserModel.findOne.mockImplementation(() => {
        throw new Error('Database error');
      });

      const result = await service.findOne('test@example.com');

      expect(result).toBeNull();
    });
  });
});
