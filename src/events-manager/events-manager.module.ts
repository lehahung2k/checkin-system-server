import { Module } from '@nestjs/common';
import { EventsManagerController } from './controller/events-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsManager } from './entities/events-manager.entity';
import { EventsManagerService } from './services/events-manager.service';
import { EventsManagerRepository } from './repository/events-manager.repository';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';
import { PointsOfCheckinService } from '../points-of-checkin/services/point-of-checkin.service';
import { PointsOfCheckinRepository } from '../points-of-checkin/repository/point-of-checkin.repository';
import { AccountsService } from '../accounts/services/accounts.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventsManager])],
  controllers: [EventsManagerController],
  providers: [
    EventsManagerService,
    EventsManagerRepository,
    AccountsRepository,
    AccountsService,
    PointsOfCheckinRepository,
    PointsOfCheckinService,
  ],
  exports: [EventsManagerService],
})
export class EventsManagerModule {}
