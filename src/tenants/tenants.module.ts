import { Module } from '@nestjs/common';
import { TenantsController } from './controller/tenants.controller';
import { TenantsService } from './tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenants } from './tenants.entity';
import { TenantsRepository } from './tenants.repository';
import { AccountsRepository } from '../accounts/accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tenants])],
  controllers: [TenantsController],
  providers: [TenantsService, TenantsRepository, AccountsRepository],
  exports: [TenantsService, TenantsRepository, AccountsRepository],
})
export class TenantsModule {}
