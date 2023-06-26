import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TransactionsDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  pointCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  guestCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  note: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  createdAt: Date;

  @ApiPropertyOptional()
  checkinImg1: Buffer;

  @ApiPropertyOptional()
  checkinImg2: Buffer;
}
