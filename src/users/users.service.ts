import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { comparePasswords } from '@app/auth/auth.util';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async createUser(
    email: string,
    username: string,
    password: string,
  ): Promise<User | { message: string }> {
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const newUser = (
        await this.userModel.create({ email, username, password })
      ).save(); // Usamos create() en lugar de new
      return newUser;
    } catch (error: any) {
      return {
        message: error.message ? error.message : 'Unknown error',
      };
    }
  }

  async validateUser(email: string, plainPassword: string): Promise<boolean> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        return false;
      }

      return comparePasswords(plainPassword, user.password);
    } catch (error) {
      console.error('validateUser Error: ', error);
      return false;
    }
  }

  async findOne(email: string) {
    try {
      return this.userModel.findOne({
        email,
      });
    } catch (error: any) {
      console.error('UsersService.findOne Error:', error);
      return null;
    }
  }
}
