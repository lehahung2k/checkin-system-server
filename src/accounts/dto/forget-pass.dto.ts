import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ForgetPassDto {
  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  confirmMailToken: string;
}
