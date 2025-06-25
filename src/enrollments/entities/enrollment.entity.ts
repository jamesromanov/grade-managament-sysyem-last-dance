import { Auth } from 'src/auth/entities/auth.entity';
import { Course } from 'src/courses/entities/course.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'enrollments' })
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Course)
  courseId: Course;

  @ManyToOne(() => Auth)
  userId: Auth;

  @CreateDateColumn()
  createdAt: Date;
}
