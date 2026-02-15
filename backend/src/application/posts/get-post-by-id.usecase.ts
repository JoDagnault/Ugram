import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';
import { ForbiddenError } from '../../errors/forbidden.error';

export class GetPostByIdUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    /**
     * Read a post by id.
     *
     * - Public context: call with `userId = undefined` (e.g. GET /posts/:id)
     * - Owner-only context: call with `userId = <currentUserId>` (e.g. GET /users/me/posts/:id)
     */
    async execute(id: string, userId?: string): Promise<Post> {
        const post: Post = await this.postsRepository.findById(id);

        // If a userId is provided, this usecase is being used in an owner-only context.
        // In that case, only the owner can access the post.
        if (userId && post.userId !== userId) {
            throw new ForbiddenError('You are not allowed to access this post');
        }

        return post;
    }
}
