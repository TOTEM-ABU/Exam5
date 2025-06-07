import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class LevelMasterDto {
  @ApiProperty({ example: 'levelID (UUID)' })
  @IsString()
  @IsUUID()
  levelId: string;
}
