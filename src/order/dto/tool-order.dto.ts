import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class OrderToolDto {
  @ApiProperty({ example: "tool's (UUID)" })
  @IsUUID()
  @IsString()
  toolId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  count: number;
}
