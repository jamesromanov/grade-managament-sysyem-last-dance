import { forwardRef, Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { AssigmentModule } from 'src/assigment/assigment.module';

@Module({
  imports: [forwardRef(() => AssigmentModule)],
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
