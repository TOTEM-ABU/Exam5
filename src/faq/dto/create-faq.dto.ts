import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ example: 'Savol???' })
  @IsString()
  question: string;

  @ApiProperty({ example: 'Javob!!!' })
  @IsString()
  answer: string;
}
