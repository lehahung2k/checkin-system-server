import { Module } from '@nestjs/common';
import { AccountsController } from './controller/accounts.controller';

@Module({
  controllers: [AccountsController]
})
export class AccountsModule {}
