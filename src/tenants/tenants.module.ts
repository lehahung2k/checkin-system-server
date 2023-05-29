import { Module } from '@nestjs/common';
import { TenantsController } from './controller/tenants.controller';
import { TenantsService } from './services/tenants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenants } from './entities/tenants.entity';
import { TenantsRepository } from './repository/tenants.repository';
import { AccountsRepository } from '../accounts/repository/accounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tenants])],
  controllers: [TenantsController],
  providers: [TenantsService, TenantsRepository, AccountsRepository],
  exports: [TenantsService, TenantsRepository, AccountsRepository],
})
export class TenantsModule {}
