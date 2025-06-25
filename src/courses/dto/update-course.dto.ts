import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CourseCategory } from '../course-category';
import { CourseLevel } from '../course-level';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  @ApiProperty({
    type: 'string',
    description: 'Course name',
    default: 'some_course',
  })
  @IsOptional()
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
  @IsOptional()
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
