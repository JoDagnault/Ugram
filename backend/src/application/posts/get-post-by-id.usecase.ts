import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class GetPostByIdUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(id: string, userId?: string): Promise<Post> {
        const post = await this.postsRepository.findById(id);

        if (userId && post.userId !== userId) {
            throw new Error("Forbidden: cannot access another user's post");
        }

        return post;
    }
}
