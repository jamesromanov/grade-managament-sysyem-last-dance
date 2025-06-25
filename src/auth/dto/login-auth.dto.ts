import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol.',
  })
  @IsString()
  password: string;
}
