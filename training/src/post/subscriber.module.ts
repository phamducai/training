import { SubscriberController } from './subscriber.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  Transport,
  Client,
  ClientsModule,
} from '@nestjs/microservices';
@Module({
  imports: [
    ConfigModule,
    // ClientsModule.register([
    //   {
    //     name: 'SUBSCRIBER_SERVICE',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://admin:admin@localhost:5672'],
    //       queue: 'email-subscribers',
    //       queueOptions: {
    //         durable: true,
    //       },
    //     },
    //   },
    // ]),
  ],
  controllers: [SubscriberController],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      // useFactory: (configService: ConfigService) => {
      //   const user = configService.get('RABBITMQ_USER');
      //   const password = configService.get('RABBITMQ_PASSWORD');
      //   const host = configService.get('RABBITMQ_HOST');
      //   const queueName = configService.get('RABBITMQ_QUEUE_NAME');
      //   return ClientProxyFactory.create({
      //     transport: Transport.RMQ,
      //     options: {
      //       urls: [`amqp://${user}:${password}@${host}`],
      //       queue: queueName,
      //       queueOptions: {
      //         durable: true,
      //       },
      //     },
      //   });
      // },
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [
              `amqp://${configService.get('RABBITMQ_USER')}:${configService.get(
                'RABBITMQ_PASSWORD',
              )}@${configService.get('RABBITMQ_HOST')}`,
            ],
            queue: configService.get('RABBITMQ_QUEUE_NAME'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class SubscriberModule {}
