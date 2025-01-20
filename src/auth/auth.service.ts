import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@app/users/users.service';
import { comparePasswords } from './auth.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user && (await comparePasswords(password, user.password))) {
      const result = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
