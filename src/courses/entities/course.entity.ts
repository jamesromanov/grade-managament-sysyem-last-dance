import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CourseCategory } from '../course-category';
import { CourseLevel } from '../course-level';
import { Auth } from 'src/auth/entities/auth.entity';

@Entity({ name: 'courses' })
export class Course {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  price: number;

  @ManyToOne(() => Auth)
  teacher: Auth;

  @Column({ enum: CourseCategory })
  category: CourseCategory;

  @Column({ enum: CourseLevel, default: CourseLevel.one })
  level: CourseLevel;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
