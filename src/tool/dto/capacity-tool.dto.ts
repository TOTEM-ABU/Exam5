import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CapacityToolDto {
  @ApiProperty({ example: "capacity's UUID" })
  @IsString()
  @IsUUID()
  capacityId: string;
}
