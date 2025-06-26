import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/role';
import { UserRole } from 'src/auth/user-role';
import { Request } from 'express';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @ApiOperation({ summary: 'enroll a course' })
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @ApiOperation({ summary: 'get enrollments' })
  @Roles(UserRole.USER)
  @Get()
  getEnrollments(@Req() req: Request) {
    return this.enrollmentsService.getEnrolls(req);
  }
}
