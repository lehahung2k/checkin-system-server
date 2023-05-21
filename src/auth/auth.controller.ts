import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from '../accounts/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddAccountDto } from '../accounts/dto/add-account.dto';
import { AuthService } from './auth.service';
import {
  CREATE_ACCOUNT_FAILED,
  CREATE_ACCOUNT_SUCCESS,
  DUPLICATE_EMAIL_OR_USERNAME,
  INCORRECT_PASSWORD,
  UNAUTHORIED_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../utils/message.utils';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() loginForm: LoginDto, @Req() req: any, @Res() res: any) {
    try {
      const user = await this.authService.login(loginForm);
      const token = await this.authService.generateToken(user);

      const response = {
        token,
        fullName: user.fullName,
        role: user.role,
      };

      res.status(HttpStatus.OK).json(response);
    } catch (err) {
      let statusCode = HttpStatus.UNAUTHORIZED;

      if (err.message === USER_NOT_FOUND_MESSAGE) {
        statusCode = HttpStatus.NOT_FOUND;
      }

      if (err.message === INCORRECT_PASSWORD) {
        statusCode = HttpStatus.UNAUTHORIZED;
      }

      res.status(statusCode).json({ message: UNAUTHORIED_MESSAGE });
    }
  }
  @Post('/register')
  async register(@Body() newAccount: AddAccountDto, @Res() res) {
    try {
      // Check duplicate email or username
      const emailErr = await this.authService.isEmailTaken(newAccount.email);
      const usernameErr = await this.authService.isUsernameTaken(
        newAccount.username,
      );
      if (emailErr || usernameErr) {
        res.status(400).send(DUPLICATE_EMAIL_OR_USERNAME);
      } else {
        await this.authService.createAccount(newAccount);
        res.send(CREATE_ACCOUNT_SUCCESS);
      }
    } catch (error) {
      if (error.code === '23505') {
        res.status(500).send(CREATE_ACCOUNT_FAILED);
      }
    }
  }
}
