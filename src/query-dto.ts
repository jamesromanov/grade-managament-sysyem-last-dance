import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class QueryDto {
  @IsInt()
  @Type(() => Number)
  limit: number;
  @IsInt()
  @Type(() => Number)
  page: number;
}
