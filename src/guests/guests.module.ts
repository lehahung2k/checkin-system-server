import { Module } from '@nestjs/common';
import { GuestsController } from './controller/guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guests } from './guests.entity';
import { GuestsRepository } from './guests.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Guests])],
  controllers: [GuestsController],
  providers: [GuestsRepository],
  exports: [GuestsRepository],
})
export class GuestsModule {}
