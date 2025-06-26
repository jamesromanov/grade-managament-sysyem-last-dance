import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResultsService } from './results.service';

import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/auth.guard';

@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get()
  getresults(@Req() req: Request) {
    return this.resultsService.result(req);
  }
}
