import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PointsOfCheckin } from '../point-of-checkin/point-of-checkin.entity';

@Entity({ name: 'Transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'userId', type: 'bigint' })
  tranId: number;

  @ManyToOne(
    () => PointsOfCheckin,
    (pointsOfCheckin) => pointsOfCheckin.transactions,
  )
  pointsOfCheckin: PointsOfCheckin;

  @Column({ name: 'pointCode', length: 255 })
  pointCode: string;

  @Column({ name: 'guestCode', length: 255 })
  guestCode: string;

  @Column({ name: 'note', length: 255 })
  note: string;

  @Column({ name: 'createdAt', type: 'datetime' })
  createdAt: Date;

  @Column({ name: 'enable', type: 'bool', default: true })
  enable: boolean;

  @Column({ name: 'checkinImg1', type: 'longblob' })
  checkinImg1: Buffer;

  @Column({ name: 'checkinImg2', type: 'longblob' })
  checkinImg2: Buffer;
}
