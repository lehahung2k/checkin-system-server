import { Module } from '@nestjs/common';
import { EventsManagerController } from './controller/events-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsManager } from './entities/events-manager.entity';
import { EventsManagerService } from './services/events-manager.service';
import { EventsManagerRepository } from './repository/events-manager.repository';
import { AccountsRepository } from 'src/accounts/repository/accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventsManager])],
  controllers: [EventsManagerController],
  providers: [
    EventsManagerService,
    EventsManagerRepository,
    AccountsRepository,
  ],
  exports: [EventsManagerService],
})
export class EventsManagerModule {}
