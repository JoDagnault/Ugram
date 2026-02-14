import { PostRepository } from '../../domain/posts/post.repository';
import { ForbiddenError } from '../../errors/forbidden.error';
import { Post } from '../../domain/posts/post';

export class DeletePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<void> {
        const post: Post = await this.postsRepository.findById(postId);

        if (post.userId !== userId) {
            throw new ForbiddenError('You are not allowed to delete this post');
        }
        await this.postsRepository.deleteById(postId);
    }
}
