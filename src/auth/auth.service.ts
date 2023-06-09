import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountsRepository } from '../accounts/repository/accounts.repository';
import { AddAccountDto } from '../accounts/dto/add-account.dto';
import { Accounts } from '../accounts/entities/accounts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePassword, hashPassword } from '../utils/algorithm.utils';
import { LoginDto } from '../accounts/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  CREATE_ACCOUNT_FAILED,
  INCORRECT_PASSWORD,
  UN_ACTIVATE_ACCOUNT,
  UN_RECOGNIZED_TENANT,
  USER_NOT_FOUND_MESSAGE,
} from '../utils/message.utils';
import { TenantsRepository } from '../tenants/repository/tenants.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepo: AccountsRepository,
    private readonly tenantRepo: TenantsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginForm: LoginDto): Promise<Accounts> {
    const { username, password } = loginForm;
    const user = await this.accountRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    } else {
      if (!user.enabled) throw new NotFoundException(UN_ACTIVATE_ACCOUNT);
      const checkPass = await comparePassword(password, user.password);
      if (!checkPass) throw new UnauthorizedException(INCORRECT_PASSWORD);
      else return user;
    }
  }

  async createAccount(addNewAccount: AddAccountDto): Promise<Accounts> {
    const encryptPass = await hashPassword(addNewAccount.password);

    const newAccount: {
      username: string;
      password: any;
      fullName: string;
      phoneNumber: string;
      email: string;
      active: number;
      role: string;
      tenantCode: string;
      companyName: string;
      enabled: boolean;
    } = {
      ...addNewAccount,
      password: encryptPass,
      active: 1,
      enabled: true,
    };
    switch (addNewAccount.role) {
      case 'admin':
        return await this.accountRepo.save(newAccount);
      case 'tenant':
        return await this.accountRepo.save(newAccount);
      case 'poc': {
        if (await this.checkTenantCode(addNewAccount.tenantCode)) {
          return await this.accountRepo.save(newAccount);
        } else throw new NotFoundException(UN_RECOGNIZED_TENANT);
      }
      default:
        throw new BadRequestException(CREATE_ACCOUNT_FAILED);
    }
  }
  async isEmailTaken(email: string): Promise<boolean> {
    const existingAccount = await this.accountRepo.findOne({
      where: { email },
    });
    return !!existingAccount;
  }

  async isUsernameTaken(username: string): Promise<boolean> {
    const existingAccount = await this.accountRepo.findOne({
      where: { username },
    });
    return !!existingAccount;
  }

  async generateToken(user: Accounts): Promise<string> {
    const payload = {
      userId: user.userId,
      fullName: user.fullName,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }

  async checkTenantCode(tenantCode: string): Promise<boolean> {
    const findTenantCode = await this.tenantRepo.findOne({
      where: { tenantCode },
    });
    return !!findTenantCode;
  }
}
