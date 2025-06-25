import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CourseCategory } from '../course-category';
import { CourseLevel } from '../course-level';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({
    type: 'string',
    description: 'Course name',
    default: 'some_course',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'Course description',
    default: 'Good course',
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: 'number',
    description: 'Course price',
    default: 120,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    type: 'number',
    description: 'Course teacher',
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  teacher: number;

  @ApiProperty({
    type: 'string',
    description: 'Course category',
    default: CourseCategory.BIOLOGY,
  })
  @IsEnum(CourseCategory)
  category: CourseCategory;

  @ApiProperty({
    type: 'string',
    description: 'Course level',
    default: CourseLevel.one,
  })
  @IsEnum(CourseLevel)
  level: CourseLevel = CourseLevel.one;
}
