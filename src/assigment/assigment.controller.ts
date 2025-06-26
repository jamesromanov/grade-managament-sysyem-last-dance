import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GrateDto } from './dto/grade-assignment.dto';
import { AssigmentModule } from './assigment.module';
import { AssigmentService } from './assigment.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/guards/role';
import { UserRole } from 'src/auth/user-role';

@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.TEACHER)
@ApiBearerAuth()
@Controller('grade')
export class GradeController {
  constructor(private assing: AssigmentService) {}
  @ApiOperation({
    description: 'grade students for teachers',
    summary: 'teacher grade',
  })
  @Post(':id')
  grade(@Param('id') id: number, @Body() gradeDto: GrateDto) {
    return this.assing.grade(id, gradeDto);
  }
}
