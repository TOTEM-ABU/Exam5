import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ProductMasterDto {
  @ApiProperty({ example: 'productID (UUID)' })
  @IsString()
  @IsUUID()
  productId: string;
}
