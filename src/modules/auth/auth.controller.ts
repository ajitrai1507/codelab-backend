import { Body, Controller, Post } from '@nestjs/common';


import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from 'common/utils/api-response.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);

    return new ApiResponse({
      success: true,
      message: 'Login successful',
      data,
    });
  }
}