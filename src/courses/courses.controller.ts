import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { QueryDto } from 'src/query-dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/role';
import { UserRole } from 'src/auth/user-role';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.TEACHER)
  @ApiQuery({ name: 'limit', type: 'number' })
  @ApiQuery({ name: 'page', type: 'number' })
  @Get()
  findAll(@Query() query: QueryDto) {
    return this.coursesService.findAll(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findOne(+id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.coursesService.update(+id, updateCourseDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursesService.remove(+id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':courseId/modules')
  getInfoModules(@Param('courseId') courseId: number) {
    return this.coursesService.getModulesInfo(courseId);
  }
}
