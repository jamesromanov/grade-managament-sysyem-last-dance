import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from './entities/enrollment.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private enrolRepo: Repository<Enrollment>,
    @Inject(forwardRef(() => AuthService)) private auth: AuthService,
    @Inject(forwardRef(() => CoursesService)) private course: CoursesService,
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
}
