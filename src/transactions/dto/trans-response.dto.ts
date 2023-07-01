import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TransResponseDto {
  @ApiPropertyOptional()
  @Expose()
  tranId: number;

  @ApiPropertyOptional()
  @Expose()
  pointCode: string;

  @ApiPropertyOptional()
  @Expose()
  guestCode: string;

  @ApiPropertyOptional()
  @Expose()
  note: string;

  @ApiPropertyOptional()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional()
  @Expose()
  checkinImg1: string;

  @ApiPropertyOptional()
  @Expose()
  checkinImg2: string;
}
