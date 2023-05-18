import { Module } from '@nestjs/common';
import { EventsManagerController } from './controller/events-manager.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsManager } from './events-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventsManager])],
  controllers: [EventsManagerController],
})
export class EventsManagerModule {}
