import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class OrderProductToolDto {
  @ApiProperty({ example: "tool's (UUID)" })
  @IsString()
  @IsUUID()
  toolId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  count: number;
}
