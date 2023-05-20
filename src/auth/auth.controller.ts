import { Body, Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { LoginDto } from '../accounts/dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AddAccountDto } from '../accounts/dto/add-account.dto';
import { AuthService } from './auth.service';

@Controller('api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/login')
  async login(@Body() loginForm: LoginDto, @Req() req: any) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Login success',
      data: req.user,
    };
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
        res.status(400).send('Duplicate email or username');
      } else {
        await this.authService.createAccount(newAccount);
        res.send('Account created successfully');
      }
    } catch (error) {
      if (error.code === '23505') {
        res.status(500).send('Account creation failed');
      }
    }
  }
}
