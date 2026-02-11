import { PostRepository } from '../../domain/posts/post.repository';

export class DeletePostUsecase {
    constructor(private readonly postsRepository: PostRepository) {}

    async execute(id: string): Promise<void> {
        await this.postsRepository.deleteById(id);
    }
}
