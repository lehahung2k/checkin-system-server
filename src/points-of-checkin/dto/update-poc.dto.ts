import { IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePocDto {
  @IsString()
  @ApiPropertyOptional()
  pointName?: string;

  @IsString()
  @ApiPropertyOptional()
  pointNote?: string;
}
