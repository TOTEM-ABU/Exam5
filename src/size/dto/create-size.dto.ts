import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty({ example: '15-20(cm)' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: '15-20(см)' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: '15-20(cm)' })
  @IsString()
  name_en: string;
}
