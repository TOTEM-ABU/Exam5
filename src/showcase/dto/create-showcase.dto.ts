import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateShowcaseDto {
  @ApiProperty({ example: 'Any name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Any description' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Any link' })
  @IsString()
  link: string;

  @ApiProperty({ example: 'Any image' })
  @IsString()
  image: string;
}
