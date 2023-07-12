import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { STRONG_PASSWORD_MESSAGE } from '../../utils/message.utils';

export class AddAccountDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @IsStrongPassword({ minLength: 4 }, { message: STRONG_PASSWORD_MESSAGE })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @ApiPropertyOptional()
  @IsString()
  companyName: string;

  @ApiPropertyOptional()
  @IsString()
  tenantCode: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  @IsString()
  role: string;
}
