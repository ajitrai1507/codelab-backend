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

    async sendResetPasswordEmail(
        email: string,

        token: string,
    ) {
        const resetUrl =
            `http://localhost:5173/reset-password/${token}`;

        await this.transporter.sendMail({
            from: process.env.MAIL_FROM,

            to: email,

            subject: 'Reset Your Password',

            html: `
      <h1>Reset Password</h1>

      <p>Click below to reset your password:</p>

      <a href="${resetUrl}">
        Reset Password
      </a>
    `,
        });
    }
}