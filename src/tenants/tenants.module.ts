import { Module } from '@nestjs/common';
import { TenantsController } from './controller/tenants.controller';
import { TenantsService } from './tenants.service';

@Module({
  controllers: [TenantsController],
  providers: [TenantsService]
})
export class TenantsModule {}
