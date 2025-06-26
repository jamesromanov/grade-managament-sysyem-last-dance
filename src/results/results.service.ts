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

@Injectable()
export class ResultsService {
  constructor(
    @Inject(forwardRef(() => AssigmentService)) private assgn: AssigmentService,
  ) {}
  async result(req: Request) {
    const id = req.user?.id;
    if (!id) throw new UnauthorizedException('Please login');
    const asn = await this.assgn.findOne(id);

    return asn;
  }
}
