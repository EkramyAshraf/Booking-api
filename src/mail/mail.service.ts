import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendPasswordReset(user: any, url: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'Natours Admin <admin@natours.io>',
      subject: 'Your password reset token (valid for 10 min)',
      text: `Forgot your password? Submit a PATCH request with your new password to: ${url}.`,
    });
  }
}
