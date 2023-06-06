import { ICommandHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPostQuery } from '../query/getPost.query';
import { PostRepository } from '../post.repository';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements ICommandHandler<GetPostQuery> {
  constructor(private postRepository: PostRepository) {}

  async execute(command: GetPostQuery) {
    return await this.postRepository.findById(command.post_id);
  }
}