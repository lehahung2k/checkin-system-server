import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TenantResponseDto {
  @ApiPropertyOptional()
  @Expose()
  tenantId: number;

  @ApiPropertyOptional()
  @Expose()
  tenantCode: string;

  @ApiPropertyOptional()
  @Expose()
  tenantName: string;

  @ApiPropertyOptional()
  @Expose()
  tenantAddress: string;

  @ApiPropertyOptional()
  @Expose()
  website: string;

  @ApiPropertyOptional()
  @Expose()
  contactName: string;

  @ApiPropertyOptional()
  @Expose()
  contactPhone: string;

  @ApiPropertyOptional()
  @Expose()
  contactEmail: string;

  @ApiPropertyOptional()
  @Expose()
  enabled: boolean;
}
