import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { CloudinaryService } from '../uploads/services/cloudinary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { ApiResponse } from 'common/utils/api-response.util';
import { UpdateUserDto } from './update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ) {
    const user =
      await this.usersService.createUser(
        createUserDto,
      );

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

  @Get()
  async findAllUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('search') search?: string,
  ) {
    const users =
      await this.usersService.findAllUsers(
        Number(page),
        Number(limit),
        search,
      );

    return new ApiResponse({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    });
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user =
      await this.usersService.findUserById(id);

    return new ApiResponse({
      success: true,
      message: 'User fetched successfully',
      data: user,
    });
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user =
      await this.usersService.updateUser(
        id,
        updateUserDto,
      );

    return new ApiResponse({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user =
      await this.usersService.deleteUser(id);

    return new ApiResponse({
      success: true,
      message: 'User deleted successfully',
      data: user,
    });
  }

  @UseGuards(JwtAuthGuard)
@Post('avatar')
@UseInterceptors(FileInterceptor('file'))
async uploadAvatar(
  @Req() req: Request,

  @UploadedFile() file: Express.Multer.File,
) {
  const uploadedFile =
    await this.cloudinaryService.uploadFile(
      file,
    );

  const user =
    await this.usersService.updateUserAvatar(
      (req.user as any).userId,
      (uploadedFile as any).secure_url
    );

  return new ApiResponse({
    success: true,
    message: 'Avatar uploaded successfully',
    data: user,
  });
}
}