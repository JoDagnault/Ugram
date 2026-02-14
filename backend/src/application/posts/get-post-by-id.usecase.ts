import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';
import { ForbiddenError } from '../../errors/forbidden.error';

export class GetPostByIdUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(id: string, userId?: string): Promise<Post> {
        const post: Post = await this.postsRepository.findById(id);

        if (userId && post.userId !== userId) {
            throw new ForbiddenError('You are not allowed to access this post');
        }

        return post;
    }
}
