import { PostRepository } from '../../domain/posts/post.repository';

export class UnlikePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<void> {
        await this.postsRepository.unlikePost(postId, userId);
    }
}
