import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { UpdateStudentCourseDto } from './dto/update-student_course.dto';
import { AuthService } from 'src/auth/auth.service';
import { LessonsService } from 'src/lessons/lessons.service';
import { ModulesService } from 'src/modules/modules.service';
import { CoursesService } from 'src/courses/courses.service';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentCourse } from './entities/student_course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentCoursesService {
  constructor(
    @InjectRepository(StudentCourse)
    private studentCourses: Repository<StudentCourse>,
    @Inject(forwardRef(() => AuthService)) private user: AuthService,
    @Inject(forwardRef(() => LessonsService)) private lesson: LessonsService,
    @Inject(forwardRef(() => ModulesService)) private modul: ModulesService,
    @Inject(forwardRef(() => CoursesService)) private course: CoursesService,
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

  findAll() {
    return;
  }

  findOne(id: number) {
    return `This action returns a #${id} studentCourse`;
  }

  update(id: number, updateStudentCourseDto: UpdateStudentCourseDto) {
    return `This action updates a #${id} studentCourse`;
  }

  remove(id: number) {
    return `This action removes a #${id} studentCourse`;
  }
}
