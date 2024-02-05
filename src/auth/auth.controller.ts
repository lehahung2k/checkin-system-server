import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from '../accounts/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddAccountDto } from '../accounts/dto/add-account.dto';
import { ForgetPassDto } from '../accounts/dto/forget-pass.dto';
import { AuthService } from './auth.service';
import {
  CREATE_ACCOUNT_SUCCESS,
  LOGIN_SUCCESS,
  UN_RECOGNIZED_TENANT,
  UN_AUTHORED_MESSAGE,
  REGISTER_ACCOUNT_SUCCESS,
  FORGOT_PASS_EMAIL_SENT,
  UPDATE_PASSWORD_SUCCESS,
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
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: UN_AUTHORED_MESSAGE });
    }
  }
  @Post('/register')
  async register(@Body() newAccount: AddAccountDto, @Res() res: any) {
    try {
      await this.authService.createAccount(newAccount);
      res.status(HttpStatus.OK).json({ message: REGISTER_ACCOUNT_SUCCESS });
    } catch (error) {
      let resMsg = error.message;
      if (error.message == UN_RECOGNIZED_TENANT) resMsg = UN_RECOGNIZED_TENANT;
      res.status(HttpStatus.BAD_REQUEST).json({ message: resMsg });
    }
  }

  @Post('/register/confirm')
  async confirm(@Res() res: any, @Body() body: any) {
    try {
      const confirmMailToken = body.confirmMailToken;
      await this.authService.confirmMail(confirmMailToken);
      res.status(HttpStatus.OK).json({ message: CREATE_ACCOUNT_SUCCESS });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('/forget-pass')
  async forgetPass(@Res() res: any, @Body() body: any) {
    try {
      const email = body.email;
      await this.authService.forgotPassword(email);
      res.status(HttpStatus.OK).json({ message: FORGOT_PASS_EMAIL_SENT });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('/forget-pass/confirm')
  async confirmForgetPass(@Res() res: any, @Body() forgotPass: ForgetPassDto) {
    try {
      await this.authService.confirmForgotPassword(forgotPass);
      res.status(HttpStatus.OK).json({ message: UPDATE_PASSWORD_SUCCESS });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
}
