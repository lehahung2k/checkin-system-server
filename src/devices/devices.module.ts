import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Devices } from './devices.entity';

@Module({ imports: [TypeOrmModule.forFeature([Devices])] })
export class DevicesModule {}
