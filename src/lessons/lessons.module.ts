import { forwardRef, Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { Course } from 'src/courses/entities/course.entity';
import { ModulesModule } from 'src/modules/modules.module';
import { CoursesModule } from 'src/courses/courses.module';
import { RedisService } from 'src/redis/redis.service';
import { Assigment } from 'src/assigment/entities/assigment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    forwardRef(() => CoursesModule),
    forwardRef(() => ModulesModule),
    forwardRef(() => Assigment),
  ],
  controllers: [LessonsController],
  providers: [LessonsService, RedisService],
  exports: [LessonsService],
})
export class LessonsModule {}
