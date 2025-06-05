import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCapacityDto {
  @ApiProperty({ example: '5 kVA' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: '5 кВа' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: '5 kVA' })
  @IsString()
  name_en: string;
}
