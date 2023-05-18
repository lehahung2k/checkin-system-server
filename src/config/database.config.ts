import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Accounts } from '../accounts/accounts.entity';
import { EventsManager } from '../events-manager/events-manager.entity';
import { PointsOfCheckin } from '../point-of-checkin/point-of-checkin.entity';
import { Guests } from '../guests/guests.entity';
import { Transactions } from '../transactions/transactions.entity';
import { Tenants } from '../tenants/tenants.entity';
import { Devices } from '../devices/devices.entity';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DEV_HOST,
  port: parseInt(process.env.DEV_PORT),
  username: process.env.DEV_USERNAME,
  password: process.env.DEV_PASSWORD,
  database: process.env.DEV_DATABASE,
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
};
