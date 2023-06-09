import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Guests' })
export class Guests {
  @PrimaryGeneratedColumn({ name: 'guestId', type: 'bigint' })
  guestId: number;

  @Column({ name: 'guestCode', length: 255 })
  guestCode: string;

  @Column({ name: 'guestDescription', type: 'text' })
  guestDescription: string;

  @Column({ name: 'frontImg', type: 'longblob', nullable: true })
  frontImg: Buffer;

  @Column({ name: 'backImg', type: 'longblob', nullable: true })
  backImg: Buffer;

  @Column({ name: 'identityType', nullable: false })
  identityType: string;

  @Column({ name: 'enabled', type: 'tinyint', default: true })
  enabled: boolean;
}
