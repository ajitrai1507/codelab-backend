import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { MailService } from '../mail/services/mail.service';



@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
  const existingUser =
    await this.usersRepository.findUserByEmail(
      createUserDto.email,
    );

  if (existingUser) {
    throw new BadRequestException(
      'Email already exists',
    );
  }

  const hashedPassword = await bcrypt.hash(
    createUserDto.password,
    10,
  );

  const user =
    await this.usersRepository.createUser({
      ...createUserDto,
      password: hashedPassword,
    });

  await this.mailService.sendWelcomeEmail(
    user.email,
    user.name,
  );

  return user;
}

  async findAllUsers(
    page = 1,
    limit = 10,
    search?: string,
  ) {
    return this.usersRepository.findAllUsers({
      page,
      limit,
      search,
    });
  }

  async findUserById(id: string) {
    const user =
      await this.usersRepository.findUserById(id);

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ) {
    await this.findUserById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    return this.usersRepository.updateUser(
      id,
      updateUserDto,
    );
  }

  async deleteUser(id: string) {
    await this.findUserById(id);

    return this.usersRepository.deleteUser(id);
  }

  async updateUserAvatar(
  userId: string,
  avatar: string,
) {
  await this.findUserById(userId);

  return this.usersRepository.updateUserAvatar(
    userId,
    avatar,
  );
}
}