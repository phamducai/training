import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriberSchema } from './subcribe.model';
import { SubcribeService } from './subcribe.service';
import { SubscriberRepository } from './subcribe.repository';
import { SubcribeController } from './subcribe.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Subscriber',
        schema: SubscriberSchema,
      },
    ]),
  ],
  controllers: [SubcribeController],
  providers: [SubcribeService, SubscriberRepository],
})
export class SubcribeModule {}
