import { IsNotEmpty, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class NewEventDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  eventCode: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  eventName: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  tenantCode: string;

  @IsString()
  @ApiPropertyOptional()
  eventDescription: string;

  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  startTime: Date;

  @IsNotEmpty()
  @ApiPropertyOptional()
  @IsString()
  endTime: Date;

  @ApiPropertyOptional()
  @IsString()
  eventImg: Buffer;
}
