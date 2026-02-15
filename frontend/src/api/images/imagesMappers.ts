import type { ImageDetails } from '../../types/image.ts';
import type { PostResponseDto } from './imagesResponses.ts';
import { apiUrl } from '../http.ts';

const toAbsoluteImageUrl = (url: string): string =>
    url.startsWith('/') ? apiUrl(url) : url;

export const mapPostResponseToImageDetails = (
    post: PostResponseDto,
): ImageDetails => ({
    id: post.id,
    userId: post.authorId,
    imageUrl: toAbsoluteImageUrl(post.imageURL),
    createdAt: post.createdAt,
    description: post.description,
    hashtags: post.hashtags,
    mentions: post.mentions,
    isOwner: post.isOwner,
});
