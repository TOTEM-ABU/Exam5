import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ProductLevelDto {
  @ApiProperty({ example: "level's (UUID)" })
  @IsString()
  @IsUUID()
  levelId: string;
}
