import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { ForbiddenError } from '../../errors/forbidden.error';

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
            throw new ForbiddenError('You are not allowed to update this post');
        }

        post.updateFields(fields);
        return await this.postsRepository.update(post);
    }
}
