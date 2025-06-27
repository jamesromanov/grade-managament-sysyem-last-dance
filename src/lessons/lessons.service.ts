import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './entities/lesson.entity';
import { privateDecrypt } from 'crypto';
import { Equal, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Course } from 'src/courses/entities/course.entity';
import { CoursesService } from 'src/courses/courses.service';
import { ModulesModule } from 'src/modules/modules.module';
import { ModulesService } from 'src/modules/modules.service';
import { Modul } from 'src/modules/entities/module.entity';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @Inject(forwardRef(() => CoursesService)) private courses: CoursesService,
    @Inject(forwardRef(() => ModulesService)) private modules: ModulesService,
    private redis: RedisService,
  ) {}
  async create(createLessonDto: CreateLessonDto) {
    const course = await this.courses.findOne(createLessonDto.courseId);
    const module = await this.modules.findOne(createLessonDto.moduleId);

    const lesson = this.lessonRepo.create({
      ...createLessonDto,
      moduleId: module.id as any,
      courseId: course.id,
    });

    return await this.lessonRepo.save(lesson);
  }

  async getLessons(moduleId: number) {
    const cacheData = await this.redis.get(`lesson:module:${moduleId}`);
    if (cacheData) return JSON.parse(cacheData);
    const module = (await this.modules.findOne(moduleId)) as Modul;
    const lessons = await this.lessonRepo.find({
      where: {
        moduleId: Equal(module.id),
      },
    });
    if (lessons.length === 0) throw new NotFoundException('No lessons found');
    await this.redis.set(`lesson:module:${moduleId}`, lessons, 60);
    return lessons;
  }

  async findOne(id: number) {
    const lessonCache = await this.redis.get(`lesson:id:${id}`);
    if (lessonCache) return JSON.parse(lessonCache);
    const lesson = await this.lessonRepo.findOne({ where: { id } });
    if (!lesson) throw new NotFoundException('No lessons found');
    await this.redis.set(`lesson:id:${id}`, lesson, 60);
    return lesson;
  }
}
