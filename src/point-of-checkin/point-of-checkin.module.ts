import { Module } from '@nestjs/common';
import { PointOfCheckinController } from './controller/point-of-checkin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointsOfCheckin } from './entities/point-of-checkin.entity';
import { PointOfCheckinService } from './services/point-of-checkin.service';
import { PointOfCheckinRepository } from './repository/point-of-checkin.repository';
import { EventsManagerRepository } from 'src/events-manager/repository/events-manager.repository';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PointsOfCheckin])],
  controllers: [PointOfCheckinController],
  providers: [
    PointOfCheckinService,
    PointOfCheckinRepository,
    EventsManagerRepository,
    AccountsRepository,
  ],
  exports: [PointOfCheckinRepository],
})
export class PointOfCheckinModule {}
