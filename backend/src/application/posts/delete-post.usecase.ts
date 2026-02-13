import { PostRepository } from '../../domain/posts/post.repository';

export class DeletePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<void> {
        const post = await this.postsRepository.findById(postId);
        if (!post) throw new Error('Post not found');

        if (post.userId !== userId) {
            throw new Error('Forbidden: cannot delete another users post');
        }
        await this.postsRepository.deleteById(postId);
    }
}
