import { Module } from '@nestjs/common';
import { AccountsController } from './controller/accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from './accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AccountsController],
  providers: [AccountsService, AccountsRepository],
  exports: [AccountsService, AccountsRepository],
})
export class AccountsModule {}
