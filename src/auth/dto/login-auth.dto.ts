import {
  ApiOperation,
  ApiProcessingResponse,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ type: 'string', default: 'exmaple@gmail.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: 'string', default: 'StrongPassword1!' })
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol.',
  })
  @IsString()
  password: string;
}
