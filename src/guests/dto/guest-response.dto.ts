import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GuestResponseDto {
  @ApiPropertyOptional()
  @Expose()
  guestId: number;

  @ApiPropertyOptional()
  @Expose()
  guestCode: string;

  @ApiPropertyOptional()
  @Expose()
  guestDescription: string;

  @ApiPropertyOptional()
  @Expose()
  frontImg: string;

  @ApiPropertyOptional()
  @Expose()
  backImg: string;

  @ApiPropertyOptional()
  @Expose()
  identityType: string;
}
