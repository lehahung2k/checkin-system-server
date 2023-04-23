import { Module } from '@nestjs/common';
import { TenantsController } from './controller/tenants.controller';

@Module({
  controllers: [TenantsController]
})
export class TenantsModule {}
