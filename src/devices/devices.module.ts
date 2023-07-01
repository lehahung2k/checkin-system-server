import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devices } from './entities/devices.entity';

@Module({ imports: [TypeOrmModule.forFeature([Devices])] })
export class DevicesModule {}
