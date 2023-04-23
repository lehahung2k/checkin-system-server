import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'PointOfCheckin' })
export class PointOfCheckin {
  @PrimaryGeneratedColumn({ name: 'pointId', type: 'bigint' })
  pointId: number;

  @Column({ name: 'pointCode', length: 255, nullable: false, unique: true })
  pointCode: string;

  @Column({ name: 'pointName', length: 255, nullable: false })
  pointName: string;

  @Column({ name: 'pointNote', length: 255, nullable: true })
  pointNote: string;

  @Column({ name: 'eventCode', length: 255, nullable: false })
  eventCode: string;

  @Column({ name: 'username', length: 255, nullable: false })
  username: string;

  @Column({ name: 'enable', type: 'bool', default: true })
  enable: boolean;
}
