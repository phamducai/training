import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,Inject
} from '@nestjs/common';
import {   CacheInterceptor,CACHE_MANAGER
} from '@nestjs/cache-manager';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from './command/createPost.command';
import { GetPostQuery } from './query/getPost.query';
import { Cache } from 'cache-manager';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService ,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    ) {}

    @Get(':id/get-with-cache')
    @UseInterceptors(CacheInterceptor)
    async getPostDetailWithCache(@Param('id') id: string) {
      console.log('Run here');
      console.log('dmm')
      return (await this.postService.getPostById(id)).toJSON();
    }
    @Get('cache/demo/set-cache')
    async demoSetCache() {
      return await this.postService.getAllPosts();
    }
    @Get('cache/demo/get-cache')
    async demoGetCache() {
      console.log('get')
      console.log(this.cacheManager.get('haha'))
      return this.cacheManager.get('haha');
    }

    @Get(':id/get-by-query')
    async getDetailByQuery(@Param('id') id: string) {
      
      return this.queryBus.execute(new GetPostQuery(id));
    }



  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAllPost() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return this.postService.createPost(req.user, post);
  }
  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  async createbycommand(@Req() req: any, @Body() post: CreatePostDto) {
    return this.commandBus.execute(new CreatePostCommand(req.user, post));
  }
  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postService.replacePost(id, post);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
    return true;
  }
  @Get('categories')
  async getByCategories(@Query('category_ids') category_ids) {
    console.log(category_ids);
    return await this.postService.getByCategories(category_ids);
  }

  @Get('get/array')
  async getByArray() {
    return this.postService.getByArray();
  }
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    console.log(req.user);
    await req.user.populate('posts').execPopulate();
    return req.user.posts;
  }
}
