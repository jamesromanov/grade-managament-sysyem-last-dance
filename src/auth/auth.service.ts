import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(Auth) private authRepo: Repository<Auth>) {}
  async create(createAuthDto: CreateAuthDto) {
    const user = this.authRepo.create(createAuthDto);
    return (await this.authRepo.save(user)).toJson();
  }

  async login(loginAuthDto: LoginAuthDto) {}
}
