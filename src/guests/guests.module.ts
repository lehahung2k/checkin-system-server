import { Module } from '@nestjs/common';
import { GuestsController } from './controller/guests.controller';

@Module({
  controllers: [GuestsController]
})
export class GuestsModule {}
