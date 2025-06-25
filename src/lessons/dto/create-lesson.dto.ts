import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import Module from 'module';
import { Course } from 'src/courses/entities/course.entity';
import { Modul } from 'src/modules/entities/module.entity';

export class CreateLessonDto {
  @ApiProperty({ type: 'string', default: 'some theme' })
  @IsString()
  title: string;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number;

  @ApiProperty({ type: 'number', default: 1 })
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @ApiProperty({ type: 'string', default: '12:23' })
  time: string;
}
