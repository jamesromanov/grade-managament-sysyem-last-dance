import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), forwardRef(() => Enrollment)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
