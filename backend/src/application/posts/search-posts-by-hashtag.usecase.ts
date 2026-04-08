import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class SearchPostsByHashtagUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(
        hashtag: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]> {
        const normalized = hashtag.trim().toLowerCase();
        if (!normalized) return [];
        return this.postsRepository.findByMatchingHashtag(
            normalized,
            pagination,
        );
    }

    async executeExact(
        hashtag: string,
        pagination: { page: number; limit: number },
    ): Promise<Post[]> {
        const normalized = hashtag.trim().toLowerCase();
        if (!normalized) return [];
        return this.postsRepository.findByExactHashtag(normalized, pagination);
    }
}
