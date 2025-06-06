import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
import { BrandToolDto } from './brand-tool.dto';
import { SizeToolDto } from './size-tool.dto';
import { CapacityToolDto } from './capacity-tool.dto';
import { Type } from 'class-transformer';

export class CreateToolDto {
  @ApiProperty({ example: 'Drel' })
  @IsString()
  name_uz: string;

  @ApiProperty({ example: 'Дрель' })
  @IsString()
  name_ru: string;

  @ApiProperty({ example: 'Drill' })
  @IsString()
  name_en: string;

  @ApiProperty({
    example:
      'Drel – bu yog‘och, metall yoki beton kabi materiallarda teshik ochish uchun ishlatiladi.',
  })
  @IsString()
  description_uz: string;

  @ApiProperty({
    example:
      'Дрель используется для сверления отверстий в таких материалах, как дерево, металл или бетон.',
  })
  @IsString()
  description_ru: string;

  @ApiProperty({
    example:
      'A drill is used for making holes in materials such as wood, metal, or concrete.',
  })
  @IsString()
  description_en: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'toolPicture.png' })
  @IsUrl()
  image: string;

  @ApiProperty({ type: [BrandToolDto] })
  @ValidateNested({ each: true })
  @Type(() => BrandToolDto)
  brands: BrandToolDto[];

  @ApiProperty({ type: [SizeToolDto] })
  @ValidateNested({ each: true })
  @Type(() => SizeToolDto)
  sizes: SizeToolDto[];

  @ApiProperty({ type: [CapacityToolDto] })
  @ValidateNested({ each: true })
  @Type(() => CapacityToolDto)
  capacities: CapacityToolDto[];
}
