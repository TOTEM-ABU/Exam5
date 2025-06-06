import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class BrandToolDto {
  @ApiProperty({ example: "brand's UUID" })
  @IsString()
  @IsUUID()
  brandId: string;
}
