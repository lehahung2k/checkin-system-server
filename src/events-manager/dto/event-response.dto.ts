import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class EventResponseDto {
  @ApiPropertyOptional()
  @Expose()
  eventId: number;

  @ApiPropertyOptional()
  @Expose()
  eventCode: string;

  @ApiPropertyOptional()
  @Expose()
  eventName: string;

  @ApiPropertyOptional()
  @Expose()
  tenantCode: string;

  @ApiPropertyOptional()
  @Expose()
  eventDescription: string;

  @ApiPropertyOptional()
  @Expose()
  startTime: Date;

  @ApiPropertyOptional()
  @Expose()
  endTime: Date;

  @ApiPropertyOptional()
  @Expose()
  eventImg: string;

  @ApiPropertyOptional()
  @Expose()
  enabled: boolean;
}
