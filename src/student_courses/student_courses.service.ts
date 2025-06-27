import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { AuthService } from 'src/auth/auth.service';
import { LessonsService } from 'src/lessons/lessons.service';
import { ModulesService } from 'src/modules/modules.service';
import { CoursesService } from 'src/courses/courses.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourse } from './entities/student_course.entity';
import { Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private studentCourses: Repository<StudentCourse>,
    @Inject(forwardRef(() => AuthService)) private user: AuthService,
    @Inject(forwardRef(() => LessonsService)) private lesson: LessonsService,
    @Inject(forwardRef(() => ModulesService)) private modul: ModulesService,
    @Inject(forwardRef(() => CoursesService)) private course: CoursesService,
    private redis: RedisService,
  ) {}
  async create(createStudentCourseDto: CreateStudentCourseDto) {
    const user = await this.user.findOne(createStudentCourseDto.studentId);
    const course = await this.course.findOne(createStudentCourseDto.courseId);
    const module = await this.modul.findOne(createStudentCourseDto.moduleId);
    const lesson = await this.lesson.findOne(createStudentCourseDto.lessonId);

    const student_courses = this.studentCourses.create({
      ...createStudentCourseDto,
      studentId: user.id,
      courseId: course.id,
      lessonId: lesson.id,
      moduleId: module.id,
    });
    return await this.studentCourses.save(student_courses);
  }

  async findAll(studentId: number) {
    const userCache = await this.redis.get(
      `user:student_courses:id:${studentId}`,
    );
    if (userCache) return JSON.parse(userCache);
    const user = await this.user.findOne(studentId);
    const student_courses = await this.studentCourses.find({
      where: { studentId: user.id },
      relations: ['studentId', 'courseId', 'lessonId'],
    });
    await this.redis.set(
      `user:student_courses:id:${studentId}`,
      student_courses,
      60,
    );
    return student_courses;
  }
}
