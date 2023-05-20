import { Module } from '@nestjs/common';
import { PointOfCheckinController } from './controller/point-of-checkin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsOfCheckin } from './point-of-checkin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PointsOfCheckin])],
  controllers: [PointOfCheckinController],
})
export class PointOfCheckinModule {}
