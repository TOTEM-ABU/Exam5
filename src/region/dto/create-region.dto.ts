import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Toshkent' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Ташкент' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Tashkent' })
  @IsString()
  name_en: string;
}
