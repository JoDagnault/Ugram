import { HashtagStats } from '../../domain/posts/hashtag-stats';
import { PostRepository } from '../../domain/posts/post.repository';

export class SearchHashtagsByQueryUsecase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(query: string, limit: number = 20): Promise<HashtagStats[]> {
        return this.postRepository.searchHashtagsByQuery(query, limit);
    }
}
