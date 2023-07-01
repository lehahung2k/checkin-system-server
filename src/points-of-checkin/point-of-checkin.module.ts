import { Module } from '@nestjs/common';
import { PointsOfCheckinController } from './controller/point-of-checkin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsOfCheckin } from './entities/points-of-checkin.entity';
import { PointsOfCheckinService } from './services/point-of-checkin.service';
import { PointsOfCheckinRepository } from './repository/point-of-checkin.repository';
import { EventsManagerRepository } from 'src/events-manager/repository/events-manager.repository';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';
import { AccountsService } from '../accounts/services/accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([PointsOfCheckin])],
  controllers: [PointsOfCheckinController],
  providers: [
    PointsOfCheckinService,
    PointsOfCheckinRepository,
    EventsManagerRepository,
    AccountsRepository,
    AccountsService,
  ],
  exports: [PointsOfCheckinRepository, PointsOfCheckinService],
})
export class PointsOfCheckinModule {}
