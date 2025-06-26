import { Auth } from 'src/auth/entities/auth.entity';
import { Lesson } from 'src/lessons/entities/lesson.entity';
import { Modul } from 'src/modules/entities/module.entity';
import {
  Collection,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'assignments' })
export class Assigment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Auth)
  userId: Auth;

  @Column()
  assigment_title: string;

  @Column()
  assigment_description: string;

  @ManyToOne(() => Modul)
  moduleId: Modul;

  @Column({ default: 0 })
  grade: number;
}
