import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IDENTITY_TYPE_NOT_NULL } from '../../utils/message.utils';

export class GuestsDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  guestCode: string;

  @IsString()
  @ApiPropertyOptional()
  guestDescription: string;

  @ApiPropertyOptional()
  frontImg: Buffer;

  @ApiPropertyOptional()
  backImg: Buffer;

  @IsNotEmpty({ message: IDENTITY_TYPE_NOT_NULL })
  @IsString()
  @ApiPropertyOptional()
  identityType: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  pointCode: string;
}
