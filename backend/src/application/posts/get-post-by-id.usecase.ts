import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';

export class GetPostByIdUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(id: string, requestingUserId?: string): Promise<Post> {
        return await this.postsRepository.findById(id, requestingUserId);
    }
}
