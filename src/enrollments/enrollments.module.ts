import { forwardRef, Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { AuthModule } from 'src/auth/auth.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    forwardRef(() => CoursesModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentsService, RedisService],
})
export class EnrollmentsModule {}
