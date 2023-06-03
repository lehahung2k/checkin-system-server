import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { EventsManager } from '../../events-manager/entities/events-manager.entity';
import { Accounts } from '../../accounts/entities/accounts.entity';
import { Transactions } from '../../transactions/transactions.entity';
import { Devices } from '../../devices/devices.entity';

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
    () => EventsManager,
    (eventsManager) => eventsManager.pointOfCheckin,
  )
  @JoinColumn({ name: 'eventCode', referencedColumnName: 'eventCode' })
  eventCode: EventsManager;

  @ManyToOne(() => Accounts, (accounts) => accounts.pointsOfCheckin)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  username: Accounts;

  @Column({ name: 'enabled', type: 'tinyint', default: true })
  enabled: boolean;

  @OneToMany(() => Transactions, (transactions) => transactions.pointCode)
  transactions: Promise<Transactions[]>;

  @OneToMany(() => Devices, (devices) => devices.pointCode)
  devices: Promise<Devices[]>;
}
