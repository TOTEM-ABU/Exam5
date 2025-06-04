import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  oldPassword: string;

  @ApiProperty()
  @IsString()
  @Length(4, 8)
  newPassword: string;
}
