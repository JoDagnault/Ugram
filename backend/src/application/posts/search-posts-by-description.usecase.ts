import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class SearchPostsByDescriptionUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(query: string): Promise<Post[]> {
        const trimmed = query.trim();
        if (!trimmed) {
            return [];
        }
        return this.postsRepository.findByDescription(trimmed);
    }
}
