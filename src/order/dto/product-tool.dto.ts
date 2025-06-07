import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

export class OrderProductToolDto {
  @ApiProperty({ example: "tool's (UUID)" })
  @IsUUID()
  toolId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  count: number;
}
