import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Equal, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CoursesService } from 'src/courses/courses.service';
import { Request } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private enrolRepo: Repository<Enrollment>,
    @Inject(forwardRef(() => AuthService)) private auth: AuthService,
    @Inject(forwardRef(() => CoursesService)) private course: CoursesService,
    private redis: RedisService,
  ) {}
  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const course = await this.course.findOne(createEnrollmentDto.courseId);
    const user = await this.auth.findOne(createEnrollmentDto.userId);
    const enrollment = this.enrolRepo.create({
      ...createEnrollmentDto,
      userId: user.id as any,
      courseId: course.id,
    });
    return await this.enrolRepo.save(enrollment);
  }

  async getEnrolls(req: Request) {
    const userID = req?.user?.id;
    const enrollsCache = await this.redis.get(`enrs:all:${userID}`);
    if (enrollsCache) return JSON.parse(enrollsCache);
    const enrollments = await this.enrolRepo.find({
      where: { userId: Equal(userID) },
    });

    await this.redis.set(`enrs:all:${userID}`, enrollments, 60);
    if (enrollments.length === 0)
      throw new NotFoundException('No enrollments found');
    return enrollments;
  }
}
