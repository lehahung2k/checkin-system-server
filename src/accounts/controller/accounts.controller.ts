import { Controller, Get } from '@nestjs/common';
import { AccountsService } from '../accounts.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/api/accounts')
@ApiTags('accounts')
export class AccountsController {
  constructor(private readonly accountService: AccountsService) {}

  @Get()
  async getAll() {
    return this.accountService.getAll();
  }
}
