import { registerAs } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default registerAs('mail', () => {
  return {
    host: process.env.MAIL_HOST,
    from: process.env.MAIL_USER,
    port: parseInt(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  } satisfies SMTPTransport.Options;
});
