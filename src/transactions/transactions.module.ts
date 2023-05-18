import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './transactions.entity';

@Module({ imports: [TypeOrmModule.forFeature([Transactions])] })
export class TransactionsModule {}
