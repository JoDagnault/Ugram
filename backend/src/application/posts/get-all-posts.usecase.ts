import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class GetAllPostsUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(): Promise<Post[]> {
        return await this.postsRepository.findAll();
    }
}
