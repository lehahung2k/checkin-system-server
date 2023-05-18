import { Module } from '@nestjs/common';
import { TenantsController } from './controller/tenants.controller';
import { TenantsService } from './tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenants } from './tenants.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tenants])],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {}
