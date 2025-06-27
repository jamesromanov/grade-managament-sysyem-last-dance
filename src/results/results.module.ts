import { forwardRef, Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { AssigmentModule } from 'src/assigment/assigment.module';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [forwardRef(() => AssigmentModule)],
  controllers: [ResultsController],
  providers: [ResultsService, RedisService],
})
export class ResultsModule {}
