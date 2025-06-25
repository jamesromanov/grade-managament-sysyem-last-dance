import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
} from 'class-validator';
import { UserRole } from '../user-role';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty({ type: 'string', description: 'User name', default: 'someone' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'User email',
    default: 'example@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'User password',
    default: 'StrongPassword!1',
  })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one symbol.',
  })
  password: string;

  @ApiProperty({
    type: 'string',
    description: 'User role',
    default: UserRole.USER,
  })
  @IsString()
  @IsEnum(UserRole)
  role: UserRole = UserRole.USER;
}
