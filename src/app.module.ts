import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { MailModule } from './modules/mail/mail.module';


@Module({
  imports: [PrismaModule, UsersModule, AuthModule, UploadsModule,MailModule],
})
export class AppModule {}