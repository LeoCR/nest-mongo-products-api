import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '@app/users/users.service';
import { AuthService } from './auth.service';
import { SignUpDtao } from './dtao/auth-signup.input';
import { SignInDtao } from './dtao/auth-signin.input';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Authenticate a user and generate a token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'The email of the user',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          minLength: 6,
          description: 'The password for the account',
          example: 'password123',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'User successfully authenticated' })
  @ApiResponse({ status: 401, description: 'Invalid email or password' })
  @Post('sign-in')
  async signIn(@Body() { email, password }: SignInDtao) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.authService.login(user);
  }
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'The email of the user',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          minLength: 6,
          description: 'The password for the account',
          example: 'password123',
        },
        username: {
          type: 'string',
          description: 'The username for the account',
          example: 'johndoe',
        },
      },
      required: ['email', 'password', 'username'],
    },
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Bad request or validation error' })
  @Post('sign-up')
  async register(@Body() { email, password, username }: SignUpDtao) {
    try {
      return this.userService.createUser(email, username, password);
    } catch (error: any) {
      return {
        message: error?.message ? error.message : 'Unknow Error.',
      };
    }
  }
}
