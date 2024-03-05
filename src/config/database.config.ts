import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Accounts } from '../accounts/entities/accounts.entity';
import { EventsManager } from '../events-manager/entities/events-manager.entity';
import { PointsOfCheckin } from '../points-of-checkin/entities/points-of-checkin.entity';
import { Guests } from '../guests/entities/guests.entity';
import { Transactions } from '../transactions/entities/transactions.entity';
import { Tenants } from '../tenants/entities/tenants.entity';
import { Devices } from '../devices/entities/devices.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Accounts,
    EventsManager,
    PointsOfCheckin,
    Guests,
    Transactions,
    Tenants,
    Devices,
  ],
  synchronize: false,
  migrations: [__dirname + '/migrations/*.ts'],
};
