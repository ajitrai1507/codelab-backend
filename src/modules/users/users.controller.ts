import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import type { Request } from 'express';


import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';



import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { ApiResponse } from 'common/utils/api-response.util';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    return new ApiResponse({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request) {
    return new ApiResponse({
      success: true,
      message: 'Profile fetched successfully',
      data: req.user,
    });
  }
}