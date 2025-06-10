import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateColorDto {
  @ApiProperty({ example: 'Qizil' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Красный' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Red' })
  @IsString()
  name_en: string;
}
