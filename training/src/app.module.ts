import { SubscriberModule } from './post/subscriber.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL_CLOUDE, {
      useNewUrlParser: true,
    }),
    UserModule,
    PostModule,
    SubscriberModule,
  ],
})
export class AppModule {}
