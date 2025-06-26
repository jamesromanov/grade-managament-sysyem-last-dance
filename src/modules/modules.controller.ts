import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { NumericType } from 'typeorm';
import { CreateAssigment } from './create-assigment';
import { JwtGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/role';
import { UserRole } from 'src/auth/user-role';

@ApiBearerAuth()
@UseGuards(JwtGuard, RolesGuard)
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiOperation({ summary: 'create module' })
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @Post()
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @ApiOperation({ summary: 'get lessons by module id' })
  @Roles(UserRole.ADMIN, UserRole.USER, UserRole.TEACHER)
  @Get(':moduleId/lessons')
  getLessons(@Param('moduleId') moduleId: number) {
    return this.modulesService.getLessons(moduleId);
  }

  @ApiOperation({ summary: 'assignment' })
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @Post(':moduleId/assignment')
  assign(
    @Param('moduleId') moduleId: number,
    @Body() createAssigment: CreateAssigment,
    @Req() req: Request,
  ) {
    return this.modulesService.assigment(moduleId, createAssigment, req);
  }
}
