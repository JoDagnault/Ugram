import { PostRepository } from '../../domain/posts/post.repository';
import { NotFoundError } from '../../errors/not-found.error';
import { Post } from '../../domain/posts/post';
import { ForbiddenError } from '../../errors/forbidden.error';
import { PostLike } from '../../domain/posts/post-like';

export class LikePostUseCase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(
        postId: string,
        like: PostLike,
        userId: string,
    ): Promise<Post> {
        const post = await this.postsRepository.findById(postId);
        if (!post) throw new NotFoundError('Post not found');
        if (userId !== like.from) {
            throw new ForbiddenError('You are not allowed to comment post');
        }
        post.addLike(like);
        return await this.postsRepository.update(post);
    }

    async executeDelete(postId: string, userId: string): Promise<Post> {
        const post: Post = await this.postsRepository.findById(postId);
        if (!post) throw new NotFoundError('Post not found');

        const like: PostLike | undefined = post.likes.find(
            (l) => l.from === userId,
        );
        if (!like) throw new NotFoundError('Like not found');

        post.deleteLike(userId);
        return await this.postsRepository.update(post);
    }
}
