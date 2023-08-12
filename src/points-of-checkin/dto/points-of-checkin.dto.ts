import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PointsOfCheckinDto {
  @ApiPropertyOptional()
  pointCode: string;

  @ApiPropertyOptional()
  pointName: string;

  @ApiPropertyOptional()
  pointNote: string;

  @ApiPropertyOptional()
  eventCode: string;

  @ApiPropertyOptional()
  username: string;
}
