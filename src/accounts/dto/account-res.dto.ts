import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccountResDto {
  @ApiPropertyOptional()
  @Expose()
  userId: number;

  @ApiPropertyOptional()
  @Expose()
  username: string;

  @ApiPropertyOptional()
  @Expose()
  fullName: string;

  @ApiPropertyOptional()
  @Expose()
  phoneNumber: string;

  @ApiPropertyOptional()
  @Expose()
  email: string;

  @ApiPropertyOptional()
  @Expose()
  active: number;

  @ApiPropertyOptional()
  @Expose()
  role: string;

  @ApiPropertyOptional()
  @Expose()
  tenantCode: string;

  @ApiPropertyOptional()
  @Expose()
  companyName: string;

  @ApiPropertyOptional()
  @Expose()
  enabled: boolean;
}
