import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'user register' })
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @ApiOperation({ summary: 'user login' })
  @Post('login')
  login(
    @Body() LoginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(LoginAuthDto, res);
  }

  @ApiOperation({ summary: 'user refresh' })
  @Post('refresh')
  refresh(@Req() req: Request) {
    return this.authService.refresh(req);
  }
}
