import { Injectable } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter =
    nodemailer.createTransport({
      host: process.env.MAIL_HOST,

      port: Number(process.env.MAIL_PORT),

      secure: false,

      auth: {
        user: process.env.MAIL_USER,

        pass: process.env.MAIL_PASSWORD,
      },
    });

  async sendWelcomeEmail(
    email: string,

    name: string,
  ) {
    await this.transporter.sendMail({
      from: process.env.MAIL_FROM,

      to: email,

      subject: 'Welcome to Codelab 🚀',

      html: `
        <h1>Welcome ${name}</h1>

        <p>Your account has been created successfully.</p>
      `,
    });
  }
}