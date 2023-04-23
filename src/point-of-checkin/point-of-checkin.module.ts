import { Module } from '@nestjs/common';
import { PointOfCheckinController } from './controller/point-of-checkin.controller';

@Module({
  controllers: [PointOfCheckinController],
})
export class PointOfCheckinModule {}
