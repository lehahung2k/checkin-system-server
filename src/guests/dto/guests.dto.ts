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

  @IsNotEmpty()
  @ApiPropertyOptional()
  frontImg: Buffer;

  @IsNotEmpty()
  @ApiPropertyOptional()
  backImg: Buffer;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  identityType: string;
}
