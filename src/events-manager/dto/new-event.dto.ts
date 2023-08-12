import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NewEventDto {
  @IsString()
  @ApiPropertyOptional()
  eventCode: string;

  @IsString()
  @ApiPropertyOptional()
  eventName: string;

  @IsString()
  @ApiPropertyOptional()
  tenantCode: string;

  @ApiPropertyOptional()
  eventDescription: string;

  @IsString()
  @ApiPropertyOptional()
  startTime: Date;

  @ApiPropertyOptional()
  @IsString()
  endTime: Date;

  @ApiPropertyOptional()
  eventImg: Buffer;
}
