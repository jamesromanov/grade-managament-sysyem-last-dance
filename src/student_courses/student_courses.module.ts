import { forwardRef, Module } from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { StudentCoursesController } from './student_courses.controller';
import { CoursesModule } from 'src/courses/courses.module';
import { LessonsModule } from 'src/lessons/lessons.module';
import { ModulesModule } from 'src/modules/modules.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentCourse } from './entities/student_course.entity';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentCourse]),
    forwardRef(() => CoursesModule),
    forwardRef(() => LessonsModule),
    forwardRef(() => ModulesModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [StudentCoursesController],
  providers: [StudentCoursesService, RedisService],
})
export class StudentCoursesModule {}
