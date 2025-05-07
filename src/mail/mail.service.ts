import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  constructor(
    private configService: ConfigService
  ) {
    // Khởi tạo transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("EMAIL_HOST"),
      secure: false,
      auth: {
        user: this.configService.get<string>("EMAIL_USER"), // Email gửi OTP
        pass: this.configService.get<string>("EMAIL_PASSWORD"),    // App password
      },
    });
  }

  // Gửi email OTP
  async sendOtpEmail(to: string, otp: string) {
    const mailOptions = {
      from: '"EasyFarm Support" <support@gmail.com>',
      to,
      subject: 'Your EasyFarm OTP Code',
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `
        <h2>Your EasyFarm OTP Code</h2>
        <p style="font-size: 20px; color: green;"><b>${otp}</b></p>
        <p>This code will expire in 5 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
