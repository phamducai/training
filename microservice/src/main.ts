import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  //TCP
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP,
  //     options: {
  //       port: 4000,
  //     },
  //   },
  // );
  // await app.listen();

  // const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     port: 4000,
  //   },
  // });
  // await app.startAllMicroservices();

  // const user = configService.get('RABBITMQ_USER');
  // const password = configService.get('RABBITMQ_PASSWORD');
  // const host = configService.get('RABBITMQ_HOST');
  // const queueName = configService.get('RABBITMQ_QUEUE_NAME');
  // console.log(user, password, host, queueName);
  // console.log(`amqp://${user}:${password}@${host}`);
  // await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [`amqp://${user}:${password}@${host}`],
  //     queue: queueName,
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });
    await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'subscribers',
      protoPath: join(process.cwd(), 'src/subcribe/subscribers.proto'),
      url: configService.get('GRPC_CONNECTION_URL'),
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
