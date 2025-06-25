import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CourseCategory } from '../course-category';
import { CourseLevel } from '../course-level';

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

  @Column({
    default: 1,
    nullable: false,
  })
  teacher: number;

  @Column({ enum: CourseCategory })
  category: CourseCategory;

  @Column({ enum: CourseLevel, default: CourseLevel.one })
  level: CourseLevel;

  @Column({ default: true })
  active: boolean;
}
