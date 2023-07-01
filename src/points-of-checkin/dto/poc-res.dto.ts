import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PocResDto {
  @ApiPropertyOptional()
  @Expose()
  pointId: number;

  @ApiPropertyOptional()
  @Expose()
  pointCode: string;

  @ApiPropertyOptional()
  @Expose()
  pointName: string;

  @ApiPropertyOptional()
  @Expose()
  pointNote: string;

  @ApiPropertyOptional()
  @Expose({ name: 'eventCode' })
  eventCode: string;

  @ApiPropertyOptional({ name: 'username' })
  @Expose()
  username: string;

  @ApiPropertyOptional()
  @Expose()
  enabled: boolean;
}
