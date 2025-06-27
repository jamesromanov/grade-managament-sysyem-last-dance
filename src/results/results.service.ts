import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { Request } from 'express';
import { AssigmentService } from 'src/assigment/assigment.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ResultsService {
  constructor(
    @Inject(forwardRef(() => AssigmentService)) private assgn: AssigmentService,
    private redis: RedisService,
  ) {}
  async result(req: Request) {
    const id = req.user?.id;
    if (!id) throw new UnauthorizedException('Please login');
    const asnCache = await this.redis.get(`asn:id:${id}`);
    console.log(asnCache);
    const asn = await this.assgn.findOne(id);
    await this.redis.set(`asn:id:${id}`, asn, 60);

    return asn;
  }
}
