import { Course } from 'src/courses/entities/course.entity';
import { Modul } from 'src/modules/entities/module.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'lessons' })
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Modul)
  moduleId: Modul;

  @Column()
  time: string;

  @ManyToOne(() => Course)
  courseId: Course;

  @CreateDateColumn()
  createdAt: Date;
}
