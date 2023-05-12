import { Injectable } from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private usersRepository: AccountsRepository,
  ) {}
  getAll() {
    return 'Hello accounts controller';
  }
}
