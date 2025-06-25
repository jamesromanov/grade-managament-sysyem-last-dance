import { forwardRef, Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { RedisModule } from 'src/redis/redis.module';
import { RedisService } from 'src/redis/redis.service';
import { ModulesModule } from 'src/modules/modules.module';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    forwardRef(() => ModulesModule),

    forwardRef(() => Lesson),
    forwardRef(() => Enrollment),
  ],
  controllers: [CoursesController],
  providers: [CoursesService, RedisService],
  exports: [CoursesService],
})
export class CoursesModule {}
