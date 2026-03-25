import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';
import { ForbiddenError } from '../../errors/forbidden.error';

export class GetPostByIdUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(
        id: string,
        ownerUserId?: string,
        requestingUserId?: string,
    ): Promise<Post> {
        const post: Post = await this.postsRepository.findById(
            id,
            requestingUserId,
        );

        if (ownerUserId && post.userId !== ownerUserId) {
            throw new ForbiddenError('You are not allowed to access this post');
        }

        return post;
    }
}
