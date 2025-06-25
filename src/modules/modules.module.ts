import { forwardRef, Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modul } from './entities/module.entity';
import { CoursesModule } from 'src/courses/courses.module';
import { LessonsModule } from 'src/lessons/lessons.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Modul]),
    forwardRef(() => CoursesModule),
    forwardRef(() => LessonsModule),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
