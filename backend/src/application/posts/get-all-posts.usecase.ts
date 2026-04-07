import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class GetAllPostsUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute({
        page,
        limit,
    }: {
        page: number;
        limit: number;
    }): Promise<Post[]> {
        return await this.postsRepository.findAll({ page, limit });
    }

    async executeForUser(
        userId: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]> {
        return await this.postsRepository.findByUserId(userId, pagination);
    }
}
