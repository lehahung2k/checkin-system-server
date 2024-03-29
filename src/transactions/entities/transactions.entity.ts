import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { PointsOfCheckin } from '../../points-of-checkin/entities/points-of-checkin.entity';

@Entity({ name: 'Transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'userId', type: 'bigint' })
  tranId: number;

  @ManyToOne(
    () => PointsOfCheckin,
    (pointsOfCheckin) => pointsOfCheckin.transactions,
    { nullable: false },
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

  @Column({ name: 'checkinImg1', type: 'longblob', nullable: true })
  checkinImg1: Buffer;

  @Column({ name: 'checkinImg2', type: 'longblob', nullable: true })
  checkinImg2: Buffer;
}
