import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountsRepository } from '../accounts/accounts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from '../accounts/accounts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accounts])],
  controllers: [AuthController],
  providers: [AuthService, AccountsRepository],
  exports: [AuthService, AccountsRepository],
})
export class AuthModule {}
