import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Any message' })
  @IsString()
  message: string;

  @ApiProperty({ example: "order's (UUID)" })
  @IsUUID()
  @IsString()
  orderId: string;
}
