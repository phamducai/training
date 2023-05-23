/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { SubscriberRepository } from './subcribe.repository';
import { SubscriberDto } from './dto/subcribe.dto';

@Injectable()
export class SubcribeService {
  constructor(private readonly subscriberRepository: SubscriberRepository) {}
  async addSubscriber(subscriber: SubscriberDto): Promise<any> {
    console.log('addSubscriber');
    return await this.subscriberRepository.create(subscriber);
  }
  async getAllSubscribers(): Promise<any> {
    return await this.subscriberRepository.getAll();
  }
}
