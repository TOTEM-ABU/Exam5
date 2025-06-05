import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Adidas' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Адидас' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Adidas' })
  @IsString()
  name_en: string;
}
