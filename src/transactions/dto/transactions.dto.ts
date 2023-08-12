import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionsDto {
  @IsString()
  @ApiPropertyOptional()
  pointCode: string;

  @IsString()
  @ApiPropertyOptional()
  guestCode: string;

  @IsString()
  @ApiPropertyOptional()
  note: string;

  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  checkinImg1: Buffer;

  @ApiPropertyOptional()
  checkinImg2: Buffer;
}
