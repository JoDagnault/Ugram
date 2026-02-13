import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';

export class UpdatePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(
        postId: string,
        userId: string,
        fields: {
            description?: string;
            hashtags?: string[];
            mentions?: string[];
        },
    ): Promise<Post> {
        const post: Post = await this.postsRepository.findById(postId);
        if (post.userId !== userId) {
            throw new Error('Forbidden: cannot update another users post');
        }

        post.updateFields(fields);
        return await this.postsRepository.update(post);
    }
}
