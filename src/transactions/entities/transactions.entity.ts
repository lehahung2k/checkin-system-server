import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { PointsOfCheckin } from '../../point-of-checkin/entities/point-of-checkin.entity';

@Entity({ name: 'Transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'userId', type: 'bigint' })
  tranId: number;

  @ManyToOne(
    () => PointsOfCheckin,
    (pointsOfCheckin) => pointsOfCheckin.transactions,
  )
  @JoinColumn({ name: 'pointCode', referencedColumnName: 'pointCode' })
  pointCode: PointsOfCheckin;

  @Column({ name: 'guestCode', length: 255 })
  guestCode: string;

  @Column({ name: 'note', length: 255 })
  note: string;

  @Column({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'enabled', type: 'tinyint', default: true })
  enabled: boolean;

  @Column({ name: 'checkinImg1', type: 'longblob' })
  checkinImg1: Buffer;

  @Column({ name: 'checkinImg2', type: 'longblob' })
  checkinImg2: Buffer;
}