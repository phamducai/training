/*
https://docs.nestjs.com/controllers#controllers
*/
import { EventPattern, GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { SubcribeService } from './subcribe.service';
import { SubscriberDto } from './dto/subcribe.dto';

@Controller()
export class SubcribeController {
  constructor(private readonly subscriberService: SubcribeService) {}

  @MessagePattern({ cmd: 'khichuacotrodat' })
  async addSubscriber(@Payload() createSubscriberDto: SubscriberDto) {
    console.log('huhu');
    return await this.subscriberService.addSubscriber(createSubscriberDto);
  }

  @MessagePattern({ cmd: 'huhu' })
  async getAllSubscriber() {
    console.log('huhu');
    return await this.subscriberService.getAllSubscribers();
  }

  @EventPattern({ cmd: 'khichuacotrodat' })
  async addSubscriberEvent(createSubscriberDto: SubscriberDto) {
    console.log('hihi');
    return this.subscriberService.addSubscriber(createSubscriberDto);
  }
  @GrpcMethod('SubscriberService', 'AddSubscriber')
  async addSubscriberGrpcMethod(createSubscriberDto: SubscriberDto) {
    return this.subscriberService.addSubscriber(createSubscriberDto);
  }
  @GrpcMethod('SubscriberService', 'GetAllSubscribers')
  async getAllSubscribersGrpcMethod() {
    return {
      data: await this.subscriberService.getAllSubscribers(),
    };
  }
}
