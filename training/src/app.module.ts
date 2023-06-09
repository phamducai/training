import { SubscriberModule } from './post/subscriber.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { ConfigModule ,ConfigService } from '@nestjs/config';
import {  MailerModule } from '@nestjs-modules/mailer';

import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL_CLOUDE, {
      useNewUrlParser: true,
    }),
    UserModule,
    PostModule,
    SubscriberModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    })
  ],
})
export class AppModule {}
