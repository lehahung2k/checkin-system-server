import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Devices' })
export class Devices {
  @PrimaryGeneratedColumn({ name: 'deviceId', type: 'bigint' })
  deviceId: number;
}
