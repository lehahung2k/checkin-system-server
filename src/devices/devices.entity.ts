import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { PointsOfCheckin } from '../points-of-checkin/entities/points-of-checkin.entity';

@Entity({ name: 'Devices' })
export class Devices {
  @PrimaryGeneratedColumn({ name: 'deviceId', type: 'bigint' })
  deviceId: number;

  @Column({ name: 'deviceName', nullable: false })
  deviceName: string;

  @ManyToOne(
    () => PointsOfCheckin,
    (pointsOfCheckin) => pointsOfCheckin.devices,
  )
  @JoinColumn({ name: 'pointCode', referencedColumnName: 'pointCode' })
  pointCode: PointsOfCheckin;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'enabled', type: 'tinyint', default: true })
  enabled: boolean;
}
