import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OtpMailDto } from './dto/otp-mail.dto';

@Injectable()
export class MailService {
  constructor(private readonly config: ConfigService) {}
  private readonly transporter = nodemailer.createTransport({
    host: this.config.get('MAIL_HOST'),
    secure: false,
    port: 587,
    from: this.config.get('MAIL_USER'),
    auth: {
      user: this.config.get('MAIL_USER'),
      pass: this.config.get('MAIL_PASS'),
    },
  });

  sendActivationMail(dto: OtpMailDto) {
    this.transporter.sendMail({
      to: dto.to,
      html: `
      <!doctype html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
            }
            .header img {
              width: 300px;
              border-radius: 15px;
            }
            .content {
              text-align: center;
            }
            .otp-code {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              background-color: #f0f0f0;
              padding: 10px 20px;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888888;
              margin-top: 20px;
            }
            .footer a {
              color: #888888;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="content">
              <h1>Подтвердите ваш аккаунт</h1>
              <p>
                Спасибо за регистрацию в IRecommend! Чтобы завершить процесс
                регистрации, пожалуйста, используйте следующий код для подтверждения:
              </p>
              <div class="otp-code">${dto.code}</div>
              <p>
                Если вы не регистрировались на нашем сайте, просто проигнорируйте это
                письмо.
              </p>
            </div>
            <div class="footer">
              <p>&copy; 2024 IRecommend. Все права защищены.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    });
  }
}
