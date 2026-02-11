import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class CreatePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(post: Post): Promise<void> {
        await this.postsRepository.save(post);
    }
}
