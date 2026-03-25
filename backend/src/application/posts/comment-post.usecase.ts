import { PostRepository } from '../../domain/posts/post.repository';
import { PostComment } from '../../domain/posts/post-comment';
import { NotFoundError } from '../../errors/not-found.error';
import { ForbiddenError } from '../../errors/forbidden.error';
import { Post } from '../../domain/posts/post';
import { CreateNotificationUsecase } from '../notifications/create-notification.usecase';

export class CommentPostUseCase {
    constructor(
        private readonly postsRepository: PostRepository,
        private readonly createNotification: CreateNotificationUsecase,
    ) {}

    async execute(
        postId: string,
        comment: PostComment,
        userId: string,
    ): Promise<Post> {
        const post = await this.postsRepository.findById(postId);
        if (!post) throw new NotFoundError('Post not found');
        if (userId !== comment.from) {
            throw new ForbiddenError('You are not allowed to comment post');
        }
        post.addComment(comment);
        const updated = await this.postsRepository.update(post);
        await this.createNotification.execute(post.userId, userId, postId, 'comment');
        return updated;
    }

    async executeDelete(
        postId: string,
        commentId: string,
        userId: string,
    ): Promise<Post> {
        const post: Post = await this.postsRepository.findById(postId);
        if (!post) throw new NotFoundError('Post not found');

        const comment: PostComment | undefined = post.comments.find(
            (c) => c.id === commentId,
        );
        if (!comment) throw new NotFoundError('Comment not found');
        if (comment.from !== userId)
            throw new ForbiddenError('You can only delete your own comments');

        post.deleteComment(commentId);
        return await this.postsRepository.update(post);
    }
}
