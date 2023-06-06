import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../command/createPost.command';
import { PostRepository } from '../post.repository';
@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
    constructor(private postRepository: PostRepository) {}
  
    async execute(command: CreatePostCommand) {
        
      command.createPostDto.user = command.user._id;
      console.log(command.createPostDto)
      return await this.postRepository.create(command.createPostDto);
    }
  }