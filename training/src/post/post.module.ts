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
  ],
  controllers: [PostController, CategoryController],
  providers: [PostService, PostRepository, CategoryRepository, CategoryService],
})
export class PostModule {}
