import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubscriberDto } from './dto/subcribe.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class SubscriberRepository {
  constructor(
    @InjectModel('Subscriber')
    private readonly subscriber: Model<SubscriberDto>,
  ) {}
  async create(doc: any): Promise<any> {
    doc._id = new ObjectId();
    return await new this.subscriber(doc).save();
  }
  async getAll(): Promise<any> {
    return await this.subscriber.find();
  }
}
