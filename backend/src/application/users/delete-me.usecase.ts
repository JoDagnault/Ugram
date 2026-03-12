import { UserRepository } from '../../domain/users/user.repository';
import { InMemoryPostsRepository } from '../../infrastructure/posts/post.repository.memory';
import { PostRepository } from '../../domain/posts/post.repository';

export class DeleteMeUsecase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly postRepository: PostRepository,
    ) {}

    async execute(userId: string): Promise<void> {
        if (this.postRepository instanceof InMemoryPostsRepository) {
            await this.postRepository.removeMentionsOfUser(userId);
        }

        await this.userRepository.deleteById(userId);
    }
}
