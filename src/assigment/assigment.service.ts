import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAssigmentDto } from './dto/create-assigment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Assigment } from './entities/assigment.entity';
import { Equal, NumericType, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

import { ModulesService } from 'src/modules/modules.service';
import { GrateDto } from './dto/grade-assignment.dto';
import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AssigmentService {
  constructor(
    @InjectRepository(Assigment) private assigRepo: Repository<Assigment>,
    @Inject(forwardRef(() => AuthService)) private user: AuthService,
    @Inject(forwardRef(() => ModulesService)) private modules: ModulesService,
    private redis: RedisService,
  ) {}
  async create(
    moduleId: number,
    createAssigmentDto: CreateAssigmentDto,
    id: number,
  ) {
    const user = await this.user.findOne(id);
    const module = await this.modules.findOne(moduleId);

    const assigment = this.assigRepo.create({
      ...createAssigmentDto,
      moduleId: module.id as any,
      userId: user.id as any,
    });

    return await this.assigRepo.save(assigment);
  }

  async grade(id: number, gradeDto: GrateDto) {
    const assig = await this.assigRepo.findOne({ where: { id } });
    if (!assig) throw new NotFoundException('No assingments found');
    assig.grade = gradeDto.grade;
    return await this.assigRepo.save(assig);
  }
  async findOne(userId: number) {
    const cacheData = await this.redis.get(`asg:userid:${this.user}`);
    if (cacheData) return JSON.parse(cacheData);

    const assgn = await this.assigRepo.find({
      where: { userId: Equal(userId) },
    });

    if (assgn.length === 0) throw new NotFoundException('No assigments found');

    await this.redis.set(`asg:userid:${this.user}`, assgn, 60);
    return assgn;
  }
}
