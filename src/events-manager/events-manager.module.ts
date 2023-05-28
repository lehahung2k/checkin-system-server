import { Module } from '@nestjs/common';
import { EventsManagerController } from './controller/events-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsManager } from './events-manager.entity';
import { EventsManagerService } from './events-manager.service';
import { EventsManagerRepository } from './events-manager.repository';
import { TenantsRepository } from 'src/tenants/tenants.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EventsManager])],
  controllers: [EventsManagerController],
  providers: [EventsManagerService, EventsManagerRepository, TenantsRepository],
  exports: [EventsManagerService],
})
export class EventsManagerModule {}
