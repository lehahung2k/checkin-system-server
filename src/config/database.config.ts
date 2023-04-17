import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DEV_HOST,
  port: parseInt(process.env.DEV_PORT),
  username: process.env.DEV_USERNAME,
  password: process.env.DEV_PASSWORD,
  database: process.env.DEV_DATABASE,
  entities: [],
  synchronize: true,
};
