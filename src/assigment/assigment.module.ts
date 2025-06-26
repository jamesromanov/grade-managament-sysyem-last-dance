import { forwardRef, Module } from '@nestjs/common';
import { AssigmentService } from './assigment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assigment } from './entities/assigment.entity';
import { LessonsModule } from 'src/lessons/lessons.module';
import { AuthModule } from 'src/auth/auth.module';
import { ModulesModule } from 'src/modules/modules.module';
import { GradeController } from './assigment.controller';
import { RedisService } from 'src/redis/redis.service';
import { ResultsModule } from 'src/results/results.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assigment]),
    forwardRef(() => AuthModule),
    forwardRef(() => LessonsModule),
    forwardRef(() => ModulesModule),
    forwardRef(() => ResultsModule),
  ],
  controllers: [GradeController],
  providers: [AssigmentService, RedisService],
  exports: [AssigmentService],
})
export class AssigmentModule {}
