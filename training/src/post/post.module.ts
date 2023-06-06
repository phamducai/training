import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostSchema } from './post.model';
import { MongooseModule } from '@nestjs/mongoose';
import { CategorySchema } from './category.model';
import { UserModule } from 'src/user/user.module';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { CategoryService } from './category.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreatePostHandler } from './handler/createPost';
import { GetPostHandler } from './handler/getPost.handler';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
    UserModule,
    CqrsModule,
    CacheModule.register({
      imports:[ConfigModule],
      inject:[ConfigService],
     useFactory: async (configService: ConfigService):Promise<any> => ({
      // nhieu thang dung chung
       // isGlobal: true,
       store: redisStore,
       host: configService.get<string>('REDIS_HOST'),
       port: configService.get<number>('REDIS_PORT'),
       
     }),
    })
  ],
  controllers: [PostController, CategoryController],
  providers: [PostService, PostRepository, CategoryRepository, CategoryService ,CreatePostHandler,GetPostHandler],
})
export class PostModule {}
