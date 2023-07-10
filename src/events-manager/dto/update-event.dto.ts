import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @ApiPropertyOptional()
  eventName?: string;

  @IsString()
  @ApiPropertyOptional()
  eventDescription?: string;

  @IsString()
  @ApiPropertyOptional()
  startTime?: Date;

  @IsString()
  @ApiPropertyOptional()
  endTime?: Date;

  @ApiPropertyOptional()
  eventImg?: Buffer;
}
