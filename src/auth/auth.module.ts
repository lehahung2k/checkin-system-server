import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccountsRepository } from '../accounts/accounts.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Accounts } from '../accounts/accounts.entity';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Accounts]),
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccountsRepository],
  exports: [AuthService, AccountsRepository],
})
export class AuthModule {}
