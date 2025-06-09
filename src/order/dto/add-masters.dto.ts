import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, IsString } from 'class-validator';

export class AddMastersToOrderDto {
  @ApiProperty({ example: "order's (UUID)" })
  @IsUUID()
  @IsString()
  orderId: string;

  @ApiProperty({ example: ['uuid1', 'uuid2'], type: [String] })
  @IsArray()
  @IsUUID('all', { each: true })
  masterIds: string[];
}
