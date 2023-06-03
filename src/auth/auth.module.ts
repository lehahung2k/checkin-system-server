import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountsRepository } from '../accounts/repository/accounts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from '../accounts/entities/accounts.entity';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { TenantsRepository } from '../tenants/repository/tenants.repository';
import { RoleGuard } from './role.guard';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountsRepository, TenantsRepository, RoleGuard],
  exports: [AuthService, AccountsRepository, TenantsRepository, RoleGuard],
})
export class AuthModule {}
