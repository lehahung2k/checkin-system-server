import { Module } from '@nestjs/common';
import { GuestsController } from './controller/guests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guests } from './entities/guests.entity';
import { GuestsRepository } from './repository/guests.repository';
import { GuestsService } from './services/guests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Guests])],
  controllers: [GuestsController],
  providers: [GuestsRepository, GuestsService],
  exports: [GuestsRepository],
})
export class GuestsModule {}
