import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Course } from 'src/courses/entities/course.entity';

export class CreateModuleDto {
  @ApiProperty({ type: 'string', default: 'New biological operation learning' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number | Course;
}
