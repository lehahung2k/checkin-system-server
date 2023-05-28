import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddTenantDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  tenantCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  tenantName: string;

  @IsString()
  @ApiPropertyOptional()
  tenantAddress: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  website: string;

  @ApiPropertyOptional()
  @IsString()
  contactName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsPhoneNumber('VN')
  contactPhone: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  contactEmail: string;
}
