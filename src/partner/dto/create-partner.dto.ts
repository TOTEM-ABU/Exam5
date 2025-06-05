import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreatePartnerDto {
  @ApiProperty({ example: 'Any name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Any image' })
  @IsString()
  @IsUrl()
  image: string;
}
