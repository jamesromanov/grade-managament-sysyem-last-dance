import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOctal } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty({ type: 'number', default: 1 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
