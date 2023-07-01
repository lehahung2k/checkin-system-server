import { IsNotEmpty } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PointsOfCheckinDto {
  @IsNotEmpty()
  @ApiPropertyOptional()
  pointCode: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  pointName: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  pointNote: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  eventCode: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  username: string;
}
