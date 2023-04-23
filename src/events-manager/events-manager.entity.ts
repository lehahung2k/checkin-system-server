import { PointOfCheckin } from 'src/point-of-checkin/point-of-checkin.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'EventsMng' })
export class EventsManagerEntity {
  @PrimaryGeneratedColumn({ name: 'eventId', type: 'bigint' })
  eventId: number;

  @Column({ name: 'eventCode' })
  eventCode: string;

  @Column({ name: 'eventName' })
  eventName: string;

  @Column({ name: 'tenantCode' })
  tenantCode: string;

  @Column({ name: 'eventDescription', type: 'text' })
  eventDescription: string;

  @Column({ name: 'startTime', type: 'datetime' })
  startTime: Date;

  @Column({ name: 'endTime', type: 'datetime' })
  endTime: Date;

  @Column({ name: 'eventImg', type: 'longblob' })
  eventImg: Buffer;

  @Column({ name: 'enable', type: 'bool', default: true })
  enable: boolean;

  @OneToMany(() => PointOfCheckin, (pointOfCheckin) => pointOfCheckin.eventCode)
  pointOfCheckin: PointOfCheckin[];
}
