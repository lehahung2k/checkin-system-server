import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GuestsDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  guestCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  guestDescription: string;

  @ApiPropertyOptional()
  frontImg: Buffer;

  @ApiPropertyOptional()
  backImg: Buffer;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  identityType: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  pointCode: string;
}
