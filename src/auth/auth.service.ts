import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwt: JwtService,
  ) {}
  async create(createAuthDto: CreateAuthDto) {
    const user = this.authRepo.create(createAuthDto);
    return (await this.authRepo.save(user)).toJson();
  }

  async login(loginAuthDto: LoginAuthDto, res: Response) {
    const { email, password } = loginAuthDto;
    const user = await this.validateUser(email, password);

    const payload = { id: user.id, role: user.role };

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXP,
    });
    const options = {
      maxAge: eval(process.env.COOKIE_EXP as string),
      secure: false,
      httpOnly: true,
    };

    res.cookie('jwt', refreshToken, options);
    user.refreshToken = refreshToken;

    await this.authRepo.save(user);
    return 'Succesfully logged in';
  }

  async refresh(req: Request) {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) throw new UnauthorizedException('Token is invalid');

    const validaToken = await this.jwt.verifyAsync(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });

    const user = await this.authRepo.findOne({
      where: { refreshToken: refreshToken },
    });
    if (user?.id !== validaToken.id)
      throw new NotFoundException('Token is invalid');

    const payload = { id: user?.id, role: user?.role };
    const acccessToken = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXP,
    });

    return { acccessToken };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.authRepo.findOne({
      where: { email, isActive: true },
    });

    if (!user) throw new BadRequestException('Invalid password or email');
    const compatePassword = await user.comparePassword(pass);
    if (!compatePassword)
      throw new BadRequestException('Invalid password or email');

    return user;
  }

  async findOne(id: number) {
    const user = await this.authRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('No users found');
    return user;
  }
}
