import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class SizeToolDto {
  @ApiProperty({ example: "size's UUID" })
  @IsString()
  @IsUUID()
  sizeId: string;
}
