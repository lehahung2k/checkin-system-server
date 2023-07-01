import { PointsOfCheckin } from 'src/points-of-checkin/entities/points-of-checkin.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tenants } from '../../tenants/entities/tenants.entity';

@Entity({ name: 'EventsMng' })
export class EventsManager {
  @PrimaryGeneratedColumn({ name: 'eventId', type: 'bigint' })
  eventId: number;

  @Column({ name: 'eventCode', unique: true })
  eventCode: string;

  @Column({ name: 'eventName' })
  eventName: string;

  @ManyToOne(() => Tenants, (tenants) => tenants.eventsManager, {
    nullable: false,
  })
  @JoinColumn({ name: 'tenantCode', referencedColumnName: 'tenantCode' })
  tenantCode: Tenants;

  @Column({ name: 'eventDescription', type: 'text' })
  eventDescription: string;

  @Column({ name: 'startTime', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'endTime', type: 'datetime' })
  endTime: Date;

  @Column({ name: 'eventImg', type: 'longblob', nullable: true })
  eventImg: Buffer;

  @Column({ name: 'enabled', type: 'tinyint', default: true })
  enabled: boolean;

  @OneToMany(
    () => PointsOfCheckin,
    (pointsOfCheckin) => pointsOfCheckin.eventCode,
  )
  pointsOfCheckin: Promise<PointsOfCheckin[]>;
}
