import { PostRepository } from '../../domain/posts/post.repository';
import { Post } from '../../domain/posts/post';
import { ForbiddenError } from '../../errors/forbidden.error';
import { BadRequestError } from '../../errors/bad-request.error';
import { UserRepository } from '../../domain/users/user.repository';

export class UpdatePostUsecase {
    constructor(
        private readonly postsRepository: PostRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async execute(
        postId: string,
        userId: string,
        fields: {
            description?: string;
            hashtags?: string[];
            mentions?: string[];
        },
    ): Promise<Post> {
        const post: Post = await this.postsRepository.findById(postId);
        if (post.userId !== userId) {
            throw new ForbiddenError('You are not allowed to update this post');
        }

        const mentionsToValidate = fields.mentions ?? post.mentions;
        if (
            mentionsToValidate.length > 0 &&
            !(await this.userRepository.mentionedUserIdsExist(
                mentionsToValidate,
            ))
        ) {
            throw new BadRequestError(
                'One or more mentioned users do not exist',
            );
        }

        post.updateFields(fields);
        return await this.postsRepository.update(post);
    }
}
