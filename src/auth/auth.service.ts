import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

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

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;
    const user = await this.validateUser(email, password);

    const payload = { id: user.id, role: user.role };

    const token = await this.jwt.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXP,
    });

    return { token };
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
