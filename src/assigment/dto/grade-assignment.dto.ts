import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class GrateDto {
  @ApiProperty({ type: 'number', default: 0 })
  @IsNumber()
  @Max(5)
  @Min(1)
  grade: number;
}
