import { ApiProperty } from '@nestjs/swagger';
import { IsPassportNumber, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  surName: string;

  @ApiProperty({ example: '+998883334565' })
  @IsString()
  @IsPassportNumber('UZ')
  phone: string;

  @ApiProperty({ example: 'Some address' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'Message' })
  @IsString()
  message: string;
}
