import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class SignInDtao {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
