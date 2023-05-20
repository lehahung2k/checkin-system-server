import { Module } from '@nestjs/common';
import { GuestsController } from './controller/guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guests } from './guests.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guests])],
  controllers: [GuestsController],
})
export class GuestsModule {}
