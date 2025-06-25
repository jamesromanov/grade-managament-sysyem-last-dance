import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Modul } from './entities/module.entity';
import { MongoServerClosedError, Repository } from 'typeorm';
import { CoursesService } from 'src/courses/courses.service';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { privateDecrypt } from 'crypto';
import { LessonsService } from 'src/lessons/lessons.service';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Modul) private moduleRepo: Repository<Modul>,
    @Inject(forwardRef(() => CoursesService))
    private courses: CoursesService,
    @Inject(forwardRef(() => LessonsService)) private lesson: LessonsService,
  ) {}
  async create(createModuleDto: CreateModuleDto) {
    const course = await this.courses.findOne(
      createModuleDto.courseId as number,
    );
    const module = this.moduleRepo.create({
      ...createModuleDto,
      courseId: course.id,
    });
    return await this.moduleRepo.save(module);
  }

  async getInfo(id: number) {
    const course = await this.courses.findOne(id);
    const modules = await this.moduleRepo.find({
      where: {
        courseId: course.id,
      },
    });
    if (modules.length === 0) throw new NotFoundException('No modules found');
    return modules;
  }

  async findOne(id: number) {
    const module = await this.moduleRepo.findOne({ where: { id } });
    if (!module) throw new NotFoundException('No modules found');
    return module;
  }

  async getLessons(moduleId: number) {
    const lessons = await this.lesson.getLessons(moduleId);
    return lessons;
  }
}
