import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Accounts } from '../accounts/accounts.entity';

@Entity()
export class Tenants {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  tenantId: number;

  @Column({ unique: true })
  tenantCode: string;

  @Column()
  tenantName: string;

  @Column()
  tenantAddress: string;

  @Column()
  website: string;

  @Column()
  contactName: string;

  @Column()
  contactPhone: string;

  @Column()
  contactEmail: string;

  @Column()
  enable: boolean;

  @ManyToMany(() => Accounts, (account) => account.tenants)
  accounts: Accounts[];
}
