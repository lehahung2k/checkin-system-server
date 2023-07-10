import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { INVALID_EMAIL } from '../../utils/message.utils';

export class UpdateTenantDto {
  @IsString()
  @ApiPropertyOptional()
  tenantAddress?: string;

  @IsString()
  @ApiPropertyOptional()
  website?: string;

  @IsString()
  @ApiPropertyOptional()
  contactName?: string;

  @IsString()
  @ApiPropertyOptional()
  @IsPhoneNumber('VN')
  contactPhone?: string;

  @IsString()
  @ApiPropertyOptional()
  @IsEmail({}, { message: INVALID_EMAIL })
  contactEmail?: string;
}
