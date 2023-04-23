import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Guests' })
export class Guests {
  @PrimaryGeneratedColumn({ name: 'guestId', type: 'bigint' })
  guestId: number;

  @Column({ name: 'guestCode', length: 255, unique: true })
  guestCode: string;

  @Column({ name: 'guestDescription', type: 'text', nullable: true })
  guestDescription: string;

  @Column({ name: 'frontImg', type: 'blob', nullable: true })
  frontImg: Buffer;

  @Column({ name: 'backImg', type: 'blob', nullable: true })
  backImg: Buffer;

  @Column({ name: 'identityType', nullable: false })
  identityType: string;

  @Column({ name: 'enable', type: 'boolean', default: true })
  enable: boolean;
}
