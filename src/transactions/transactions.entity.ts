import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PointsOfCheckin } from '../point-of-checkin/point-of-checkin.entity';

@Entity({ name: 'Transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'userId', type: 'bigint' })
  tranId: number;

  @Column({ name: 'pointCode', length: 255 })
  pointCode: string;

  @ManyToOne(
    () => PointsOfCheckin,
    (pointsOfCheckin) => pointsOfCheckin.transactions,
  )
  pointsOfCheckin: PointsOfCheckin;
}
