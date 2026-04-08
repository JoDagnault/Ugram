import { PostRepository } from '../../domain/posts/post.repository';

export class GetPopularHashtagsUsecase {
    constructor(private readonly postRepository: PostRepository) {}

    async execute(limit: number = 10) {
        return this.postRepository.getPopularHashtags(limit);
    }
}
