import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStudentCourseDto {
  @ApiProperty({ type: 'number', default: 1 })
  @IsNotEmpty()
  @IsNumber()
  moduleId: number;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNotEmpty()
  @IsNumber()
  lessonId: number;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNotEmpty()
  @IsNumber()
  courseId: number;
}
