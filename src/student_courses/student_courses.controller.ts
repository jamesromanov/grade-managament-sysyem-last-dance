import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { StudentCoursesService } from './student_courses.service';
import { CreateStudentCourseDto } from './dto/create-student_course.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/role';
import { UserRole } from 'src/auth/user-role';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('student-courses')
export class StudentCoursesController {
  constructor(private readonly studentCoursesService: StudentCoursesService) {}

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Post()
  create(@Body() createStudentCourseDto: CreateStudentCourseDto) {
    return this.studentCoursesService.create(createStudentCourseDto);
  }

  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get(':studentId')
  findAll(@Param('studentId') studentId: number) {
    return this.studentCoursesService.findAll(studentId);
  }
}
