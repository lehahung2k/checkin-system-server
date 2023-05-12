import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Accounts } from './accounts.entity';

/**
 * UsersRepository class for user repository
 */
@Injectable()
export class AccountsRepository extends Repository<Accounts> {
  constructor(private readonly dataSource: DataSource) {
    super(Accounts, dataSource.createEntityManager());
  }
}
