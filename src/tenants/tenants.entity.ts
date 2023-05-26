import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Accounts } from '../accounts/accounts.entity';
import { EventsManager } from 'src/events-manager/events-manager.entity';

@Entity({ name: 'Tenants' })
export class Tenants {
  @PrimaryGeneratedColumn({ name: 'tenantId', type: 'bigint' })
  tenantId: number;

  @Column({ name: 'tenantCode', length: 255, unique: true })
  tenantCode: string;

  @Column({ name: 'tenantName', length: 255, nullable: false })
  tenantName: string;

  @Column({ name: 'tenantAddress', length: 255, nullable: false })
  tenantAddress: string;

  @Column({ name: 'website', length: 255 })
  website: string;

  @Column({ name: 'contactName', length: 255 })
  contactName: string;

  @Column({ name: 'contactPhone', length: 20 })
  contactPhone: string;

  @Column({ name: 'contactEmail', length: 255 })
  contactEmail: string;

  @Column({ name: 'enabled', type: 'tinyint', default: true })
  enabled: boolean;

  @ManyToMany(() => Accounts, (account) => account.tenants)
  accounts: Accounts[];

  @OneToMany(() => EventsManager, (eventsManager) => eventsManager.tenantCode)
  eventsManagerEntity: EventsManager[];
}
