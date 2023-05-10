import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventsManagerEntity } from '../events-manager/events-manager.entity';
import { Accounts } from '../accounts/accounts.entity';
import { Transactions } from '../transactions/transactions.entity';

@Entity({ name: 'PointsOfCheckin' })
export class PointsOfCheckin {
  @PrimaryGeneratedColumn({ name: 'pointId', type: 'bigint' })
  pointId: number;

  @Column({ name: 'pointCode', length: 255, nullable: false, unique: true })
  pointCode: string;

  @Column({ name: 'pointName', length: 255, nullable: false })
  pointName: string;

  @Column({ name: 'pointNote', length: 255, nullable: true })
  pointNote: string;

  @ManyToOne(
    () => EventsManagerEntity,
    (eventsManager) => eventsManager.pointOfCheckin,
  )
  eventsManager: EventsManagerEntity;

  @Column({ name: 'eventCode', length: 255, nullable: false })
  eventCode: string;

  @Column({ name: 'username', length: 255, nullable: false })
  @ManyToOne(() => Accounts, (accounts) => accounts.username)
  username: string;

  @Column({ name: 'enable', type: 'bool', default: true })
  enable: boolean;

  @OneToMany(() => Transactions, (transactions) => transactions.pointsOfCheckin)
  transactions: Transactions[];
}
