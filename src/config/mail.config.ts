import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import * as dotenv from 'dotenv';
dotenv.config();

export const mailConfig: MailerAsyncOptions = {
  useFactory: async () => ({
    transport: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    defaults: {
      from: `Hệ thống check-in đa điểm <${process.env.MAIL_FROM}>`,
    },
  }),
};
