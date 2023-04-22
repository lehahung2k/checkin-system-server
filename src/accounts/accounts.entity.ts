import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tenants } from '../tenants/tenants.entity';

@Entity({ name: 'Accounts' })
export class Accounts {
  @PrimaryGeneratedColumn({ name: 'userId', type: 'bigint' })
  userId: number;

  @Column({ name: 'username', length: 255, unique: true })
  username: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({ name: 'fullName', length: 255 })
  fullName: string;

  @Column({ name: 'phoneNumber', length: 20 })
  phoneNumber: string;

  @Column({ name: 'email', length: 255 })
  email: string;

  @Column({ name: 'active', type: 'int' })
  active: number;

  @Column({ name: 'role', length: 50 })
  role: string;

  @Column({ name: 'tenantCode', length: 255 })
  tenantCode: string;

  @Column({ name: 'companyName', length: 255 })
  companyName: string;

  @Column({ name: 'enable', type: 'boolean' })
  enable: boolean;

  @ManyToMany(() => Tenants, { cascade: true })
  @JoinTable({
    name: 'Accounts2Tenants',
    joinColumn: { name: 'userId', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'tenantId', referencedColumnName: 'tenantId' },
  })
  tenants: Tenants[];
}