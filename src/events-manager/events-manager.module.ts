import { Module } from '@nestjs/common';
import { EventsManagerController } from './controller/events-manager.controller';

@Module({
  controllers: [EventsManagerController]
})
export class EventsManagerModule {}
