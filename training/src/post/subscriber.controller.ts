/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Inject, OnModuleInit, Post, Req, UseGuards } from '@nestjs/common';
import {  ClientGrpc} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import SubscriberInterface from './subscriber.interface';
@Controller('subscriber')
export class SubscriberController implements OnModuleInit{

  constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private client: ClientGrpc,
  ) {}
  private gRpcService: SubscriberInterface;
  onModuleInit(): any {
   
    this.gRpcService =
      this.client.getService<SubscriberInterface>('SubscriberService');
   
      console.log(this.client.getService)


  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  async getSubscribers() {
    console.log('hello');
    return this.gRpcService.getAllSubscribers({});
  }
@Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberTCP(@Req() req: any) {
    return this.gRpcService.addSubscriber({email:req.user.email,name:req.user.name});
  }


  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // async getSubscribers() {
  //   console.log('hello');
  //   return this.client.send({ cmd: 'huhu' }, {});
  // }

  // @Post()
  // @UseGuards(AuthGuard('jwt'))
  // async createSubscriberTCP(@Req() req: any) {
  //   return this.client.send({ cmd: 'add-subscriber' }, req.user);
  // }

  // @Post('event')
  // @UseGuards(AuthGuard('jwt'))
  // async createSubscriberEvent(@Req() req: any) {
  //   this.client.emit({ cmd: 'add-subscriber' }, req.user);
  //   return true;
  // }

  // @Post('rmq')
  // @UseGuards(AuthGuard('jwt'))
  // async createPost(@Req() req: any) {
  //   console.log('haha');
  //   console.log(req.user);
  //   return this.client.send(
  //     {
  //       cmd: 'khichuacotrodat',
  //     },
  //     req.user,
  //   );
  // }
}
