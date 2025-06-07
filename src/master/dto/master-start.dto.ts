import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID, Max, Min } from 'class-validator';

export class MarkStarDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  masterId: string;

  @ApiProperty()
  @IsNumber()
  @Max(5)
  @Min(1)
  star: number;
}
