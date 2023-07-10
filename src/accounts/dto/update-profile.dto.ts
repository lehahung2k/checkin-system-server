import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { INVALID_EMAIL } from '../../utils/message.utils';

export class UpdateProfileDto {
  @IsString()
  @ApiPropertyOptional()
  fullName?: string;

  @IsString()
  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  phoneNumber?: string;

  @IsString()
  @ApiPropertyOptional()
  @IsEmail({}, { message: INVALID_EMAIL })
  email?: string;
}
