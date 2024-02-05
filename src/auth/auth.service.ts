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
import {
  comparePassword,
  generateConfirmToken,
  hashPassword,
} from '../utils/algorithm.utils';
import { LoginDto } from '../accounts/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import {
  CREATE_ACCOUNT_FAILED,
  DUPLICATE_EMAIL_OR_USERNAME,
  INCORRECT_PASSWORD,
  INCORRECT_TOKEN,
  UN_ACTIVATE_ACCOUNT,
  UN_RECOGNIZED_TENANT,
  USER_NOT_FOUND_MESSAGE,
} from '../utils/message.utils';
import { TenantsRepository } from '../tenants/repository/tenants.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgetPassDto } from '../accounts/dto/forget-pass.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Accounts)
    private readonly accountRepo: AccountsRepository,
    private readonly tenantRepo: TenantsRepository,
    private readonly jwtService: JwtService,
    private mailService: MailerService,
  ) {}

  async login(loginForm: LoginDto): Promise<Accounts> {
    const { username, password } = loginForm;
    const user = await this.accountRepo.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    } else {
      if (!user.enabled) throw new BadRequestException(UN_ACTIVATE_ACCOUNT);
      const checkPass = await comparePassword(password, user.password);
      if (!checkPass) throw new UnauthorizedException(INCORRECT_PASSWORD);
      else return user;
    }
  }

  async createAccount(addNewAccount: AddAccountDto): Promise<Accounts> {
    const isEmailTaken = await this.isEmailTaken(addNewAccount.email);
    const isUsernameTaken = await this.isUsernameTaken(addNewAccount.username);
    if (isEmailTaken || isUsernameTaken)
      throw new BadRequestException(DUPLICATE_EMAIL_OR_USERNAME);

    const confirmToken = generateConfirmToken(8);
    const encryptPass = await hashPassword(addNewAccount.password);

    const newAccount = {
      ...addNewAccount,
      password: encryptPass,
      active: 1,
      enabled: false,
      confirmMailToken: confirmToken,
    };

    switch (addNewAccount.role) {
      case 'tenant':
        newAccount.tenantCode = '';
        break;
      case 'poc':
        if (!(await this.checkTenantCode(addNewAccount.tenantCode)))
          throw new BadRequestException(UN_RECOGNIZED_TENANT);
        break;
      default:
        throw new BadRequestException(CREATE_ACCOUNT_FAILED);
    }

    await this.mailService
      .sendMail({
        to: addNewAccount.email,
        subject: 'Đăng ký thành công tài khoản',
        text:
          'Chào mừng đến với ECM. Nhập mã xác nhận để kích hoạt tài khoản: ' +
          confirmToken,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      });

    return await this.accountRepo.save(newAccount);
  }

  async confirmMail(token: string): Promise<Accounts> {
    const user = await this.accountRepo.findOne({
      where: { confirmMailToken: token },
    });
    if (!user) throw new NotFoundException(INCORRECT_TOKEN);
    user.enabled = true;
    user.confirmMailToken = '';
    return await this.accountRepo.save(user);
  }

  async forgotPassword(email: string): Promise<Accounts> {
    const user = await this.accountRepo.findOne({
      where: { email },
    });
    if (!user) throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    const confirmToken = generateConfirmToken(8);
    user.confirmMailToken = confirmToken;
    await this.mailService
      .sendMail({
        to: email,
        subject: 'Quên mật khẩu',
        text: 'Nhập mã xác nhận để đổi mật khẩu: ' + confirmToken,
      })
      .catch((err) => {
        console.log(err);
        throw new BadRequestException(err.message);
      });
    return await this.accountRepo.save(user);
  }

  async confirmForgotPassword(newPass: ForgetPassDto): Promise<Accounts> {
    const user = await this.accountRepo.findOne({
      where: { confirmMailToken: newPass.confirmMailToken },
    });
    if (!user) throw new NotFoundException(INCORRECT_TOKEN);
    user.password = await hashPassword(newPass.newPassword);
    user.confirmMailToken = '';
    return await this.accountRepo.save(user);
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
