import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';
import { QueryDto } from 'src/query-dto';
import { RedisService } from 'src/redis/redis.service';
import { ModulesService } from 'src/modules/modules.service';
import { AuthService } from 'src/auth/auth.service';
import { UserRole } from 'src/auth/user-role';
import { Auth } from 'src/auth/entities/auth.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    private redis: RedisService,
    @Inject(forwardRef(() => ModulesService))
    private readonly modules: ModulesService,
    @Inject(forwardRef(() => AuthService))
    private readonly user: AuthService,
  ) {}
  async create(createCourseDto: CreateCourseDto) {
    let user: Auth;
    const userCache = await this.redis.get(
      `user:id:${createCourseDto.teacher}`,
    );
    const userExist = await this.user.findOne(createCourseDto.teacher);
    if (userCache) user = JSON.parse(userCache);
    else user = userExist;

    if (user.role !== UserRole.TEACHER)
      throw new BadRequestException('User is not a teacher');

    await this.redis.set(`user:id:${createCourseDto.teacher}`, user, 60);
    const course = this.courseRepo.create({
      ...createCourseDto,
      teacher: user.id as any,
    });

    return await this.courseRepo.save(course);
  }

  async findAll(query: QueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    if (page < 1 || limit < 1)
      throw new BadRequestException(
        `Invalid ${page < 1 ? 'page' : 'limit'} value. Must be number`,
      );
    const offset = (page - 1) * limit;

    const cacheCourse = await this.redis.get(`users:all:${page}`);
    const cachaCourseCount = await this.redis.get(`users:all:count`);

    const [courses, totalCoursesCount] = await this.courseRepo.findAndCount({
      take: limit,
      skip: offset,
      where: { active: true },
    });
    let courseTotal: any[];
    let courseTotalCount: number;

    if (cacheCourse && cachaCourseCount) {
      courseTotal = JSON.parse(cacheCourse);
      courseTotalCount = Number(cachaCourseCount);
    } else {
      courseTotal = courses;
      courseTotalCount = totalCoursesCount;
    }

    const totalPages = Math.ceil(courseTotalCount / limit);

    if (courses.length === 0) throw new NotFoundException('No courses found');

    if (courses.length > 0 && totalCoursesCount >= 1) {
      await this.redis.set(`users:all:${page}`, courseTotal, 60);
      await this.redis.set(`users:all:count`, courseTotalCount, 60);
    }

    return {
      totalPages,
      currentPage: +page,
      hasNextPage: page < totalPages,
      totalCourses: totalCoursesCount,
      courses,
    };
  }

  async findOne(id: number) {
    const courseCache = await this.redis.get(`course:id:${id}`);

    if (courseCache) return JSON.parse(courseCache);
    const course = await this.courseRepo.findOne({
      where: { id, active: true },
    });
    if (!course) throw new NotFoundException('No courses found');

    await this.redis.set(`course:id:${id}`, course, 60);

    return course;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);

    course.name = updateCourseDto.name ?? course.name;
    course.description = updateCourseDto.description ?? course.description;
    course.price = updateCourseDto.price ?? course.price;

    if (updateCourseDto.teacher) {
      const teacher = await this.user.findOne(updateCourseDto.teacher);
      course.teacher = teacher ?? course.teacher;
    }
    course.category = updateCourseDto.category ?? course.category;
    course.level = updateCourseDto.level ?? course.level;

    await this.courseRepo.save(course);
    await this.redis.del(`course:id:${id}`);

    return course;
  }

  async remove(id: number) {
    const course = await this.findOne(id);

    course.active = false;
    await this.courseRepo.save(course);
    await this.redis.del(`course:id:${id}`);

    return `Successfully deleted`;
  }

  async getModulesInfo(courseId: number) {
    const modulesCache = await this.redis.get(`modules:all:${courseId}`);
    if (modulesCache) return JSON.parse(modulesCache);
    const modules = await this.modules.getInfo(courseId);
    await this.redis.set(`modules:all:${courseId}`, modules, 60);
    return modules;
  }
}
