import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, isString, IsString } from 'class-validator';

export class CreateAssigment {
  @ApiProperty({ type: 'string', default: 'Biology homework' })
  @IsString()
  assigment_title: string;
  @ApiProperty({
    type: 'string',
    default: 'Hello teacher i uploaded this homework',
  })
  @IsString()
  assigment_description: string;
}
