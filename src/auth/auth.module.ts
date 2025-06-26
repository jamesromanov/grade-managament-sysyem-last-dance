import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { AssigmentModule } from 'src/assigment/assigment.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    forwardRef(() => Enrollment),
    forwardRef(() => AssigmentModule),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
