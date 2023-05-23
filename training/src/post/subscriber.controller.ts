/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
@Controller('subscriber')
export class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private client: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getSubscribers() {
    console.log('hello');
    return this.client.send({ cmd: 'huhu' }, {});
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberTCP(@Req() req: any) {
    return this.client.send({ cmd: 'add-subscriber' }, req.user);
  }

  @Post('event')
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberEvent(@Req() req: any) {
    this.client.emit({ cmd: 'add-subscriber' }, req.user);
    return true;
  }

  @Post('rmq')
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any) {
    console.log('haha');
    console.log(req.user);
    return this.client.send(
      {
        cmd: 'khichuacotrodat',
      },
      req.user,
    );
  }
}
