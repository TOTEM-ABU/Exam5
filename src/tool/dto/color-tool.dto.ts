import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ColorToolDto {
  @ApiProperty({ example: "color's (UUID)" })
  @IsString()
  @IsUUID()
  colorId: string;
}
