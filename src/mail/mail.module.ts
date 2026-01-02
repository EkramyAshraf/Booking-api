import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host:
            config.get<string>('NODE_ENV') === 'production'
              ? 'smtp.sendgrid.net'
              : config.get('EMAIL_HOST'),
          port:
            config.get<string>('NODE_ENV') === 'production'
              ? 587
              : config.get<number>('EMAIL_PORT'),
          auth: {
            user:
              config.get('NODE_ENV') === 'production'
                ? 'apikey'
                : config.get('EMAIL_USERNAME'),
            pass:
              config.get('NODE_ENV') === 'production'
                ? config.get('SENDGRID_API_KEY')
                : config.get('EMAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
