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
  LOGIN_SUCCESS,
  UN_RECOGNIZED_TENANT,
  UN_AUTHORED_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../utils/message.utils';

@Controller('api/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() loginForm: LoginDto, @Req() req: any, @Res() res: any) {
    try {
      const user = await this.authService.login(loginForm);
      const token = await this.authService.generateToken(user);

      const response = {
        accessToken: token,
        user: {
          fullName: user.fullName,
          companyName: user.companyName,
          role: user.role,
        },
      };
      res.header('Authorization', `Bearer ${token}`);
      res
        .status(HttpStatus.OK)
        .json({ message: LOGIN_SUCCESS, payload: response });
    } catch (err) {
      let statusCode = HttpStatus.UNAUTHORIZED;

      if (err.message === USER_NOT_FOUND_MESSAGE) {
        statusCode = HttpStatus.NOT_FOUND;
      }

      if (err.message === INCORRECT_PASSWORD) {
        statusCode = HttpStatus.UNAUTHORIZED;
      }

      res.status(statusCode).json({ message: UN_AUTHORED_MESSAGE });
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
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: DUPLICATE_EMAIL_OR_USERNAME });
      } else {
        await this.authService.createAccount(newAccount);
        res.status(HttpStatus.OK).json({ message: CREATE_ACCOUNT_SUCCESS });
      }
    } catch (error) {
      let resMsg = CREATE_ACCOUNT_FAILED;
      if (error.message == UN_RECOGNIZED_TENANT) resMsg = UN_RECOGNIZED_TENANT;
      res.status(HttpStatus.BAD_REQUEST).json({ message: resMsg });
    }
  }
}
