import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';

export class UpdatePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(
        id: string,
        fields: {
            description?: string;
            hashtags?: string[];
            mentions?: string[];
        },
    ): Promise<Post> {
        const post = await this.postsRepository.findById(id);
        post.updateFields(fields);
        return await this.postsRepository.update(post);
    }
}
