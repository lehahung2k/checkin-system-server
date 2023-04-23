import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Accounts } from '../accounts/accounts.entity';
import { EventsManagerEntity } from 'src/events-manager/events-manager.entity';

@Entity({ name: 'Tenants' })
export class Tenants {
  @PrimaryGeneratedColumn({ name: 'tenantId', type: 'bigint' })
  tenantId: number;

  @Column({ name: 'tenanCode', length: 255, unique: true })
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

  @Column({ name: 'enable', type: 'boolean', default: true })
  enable: boolean;

  @ManyToMany(() => Accounts, (account) => account.tenantCode)
  accounts: Accounts[];

  @OneToMany(
    () => EventsManagerEntity,
    (eventsManagerEntity) => eventsManagerEntity.tenantCode,
  )
  eventsManagerEntity: EventsManagerEntity[];
}
