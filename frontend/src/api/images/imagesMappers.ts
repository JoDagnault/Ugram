import type { ImageDetails } from '../../types/image.ts';
import type { PostResponseDto } from './imagesResponses.ts';

export const mapPostResponseToImageDetails = (
    post: PostResponseDto,
): ImageDetails => ({
    id: post.id,
    userId: post.authorId,
    imageUrl: post.imageURL,
    createdAt: post.createdAt,
    description: post.description,
    hashtags: post.hashtags,
    mentionUserIds: post.mentions,
});
