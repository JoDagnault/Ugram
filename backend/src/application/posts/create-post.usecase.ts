import { Post } from '../../domain/posts/post';
import { PostRepository } from '../../domain/posts/post.repository';
import { UserRepository } from '../../domain/users/user.repository';
import { BadRequestError } from '../../errors/bad-request.error';

export class CreatePostUsecase {
    constructor(
        private readonly postsRepository: PostRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(post: Post): Promise<void> {
        if (!(await this.userRepository.mentionedUserIdsExist(post.mentions))) {
            throw new BadRequestError(
                'One or more mentioned users do not exist',
            );
        }
        await this.postsRepository.save(post);
    }
}
