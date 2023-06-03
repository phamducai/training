import { SubscriberController } from './subscriber.controller';
import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  ClientsModule,
  Transport,

} from '@nestjs/microservices';
@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'SUBSCRIBER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'subscribers',
          protoPath: join(process.cwd(), 'src/post/subscribers.proto'),
        },
      },
    ])
  ],
  controllers: [SubscriberController],
  providers: [
    // {
    //   provide: 'SUBSCRIBER_SERVICE',
    //   useFactory: (configService: ConfigService) =>
    //     ClientProxyFactory.create({
    //       transport: Transport.GRPC,
    //       options: {
    //         package: 'subscribers',
    //         protoPath: join(process.cwd(), 'src/post/subscribers.proto'),
    //         url: configService.get('GRPC_CONNECTION_URL'),
    //       },
    //     }),
    //   inject: [ConfigService],
    // },
  ],
})
export class SubscriberModule {}

//rabitmq
// providers: [
//   {
//     provide: 'SUBSCRIBER_SERVICE',
//     useFactory: (configService: ConfigService) =>
//       ClientProxyFactory.create({
//         transport: Transport.RMQ,
//         options: {
//           urls: [
//             `amqp://${configService.get('RABBITMQ_USER')}:${configService.get(
//               'RABBITMQ_PASSWORD',
//             )}@${configService.get('RABBITMQ_HOST')}`,
//           ],
//           queue: configService.get('RABBITMQ_QUEUE_NAME'),
//           queueOptions: {
//             durable: true,
//           },
//         },
//       }),
//     inject: [ConfigService],
//   },
// ],