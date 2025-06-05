import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class CreateGeneralInfoDto {
  @ApiProperty({ example: 'email@gmail.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+998883334565' })
  @IsString()
  @IsPhoneNumber('UZ')
  phones: string;

  @ApiProperty({ example: 'any://link:777.uz' })
  @IsString()
  @IsUrl()
  links: string;
}
