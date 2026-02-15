import type {
    CreateImageRequest,
    ImageDetails,
    UpdateImageRequest,
    ImageListItem,
} from '../../types/image.ts';
import { apiFetch, apiGetJsonOrUndefinedOn404 } from '../http.ts';
import { mapPostResponseToImageDetails } from './imagesMappers.ts';
import type { PostResponseDto } from './imagesResponses.ts';

const toImageListItem = (image: ImageDetails): ImageListItem => ({
    id: image.id,
    userId: image.userId,
    imageUrl: image.imageUrl,
    createdAt: image.createdAt,
});

export const getUserImages = async (
    userId: string,
): Promise<ImageListItem[]> => {
    const posts = await apiGetJsonOrUndefinedOn404<PostResponseDto[]>(
        `/users/${userId}/posts`,
    );

    if (!posts) return [];

    return posts.map(mapPostResponseToImageDetails).map(toImageListItem);
};

export const getFeedImages = async (): Promise<ImageDetails[]> => {
    const posts = await apiGetJsonOrUndefinedOn404<PostResponseDto[]>('/posts');
    if (!posts) return [];

    return posts.map(mapPostResponseToImageDetails);
};

export const getImage = async (
    imageId: string,
): Promise<ImageDetails | undefined> => {
    const post = await apiGetJsonOrUndefinedOn404<PostResponseDto>(
        `/users/me/posts/${imageId}`,
    );

    if (post) return mapPostResponseToImageDetails(post);

    const publicPost = await apiGetJsonOrUndefinedOn404<PostResponseDto>(
        `/posts/${imageId}`,
    );

    return publicPost ? mapPostResponseToImageDetails(publicPost) : undefined;
};

export const createMyImage = async (
    request: CreateImageRequest,
): Promise<ImageDetails> => {
    const formData = new FormData();
    formData.append('image', request.file);
    formData.append('description', request.description);
    formData.append('hashtags', JSON.stringify(request.hashtags));
    formData.append('mentions', JSON.stringify(request.mentionUserIds));

    console.log(request.hashtags);
    console.log(JSON.stringify(request.hashtags));

    const response = await apiFetch('/users/me/posts', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    const createdPost = (await response.json()) as PostResponseDto;
    return mapPostResponseToImageDetails(createdPost);
};

export const updateMyImage = async (
    imageId: string,
    update: UpdateImageRequest,
): Promise<ImageDetails | undefined> => {
    const response = await apiFetch(`/users/me/posts/${imageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
    });

    if (response.status === 404) return undefined;
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    const updatedPost = (await response.json()) as PostResponseDto;
    return mapPostResponseToImageDetails(updatedPost);
};

export const deleteMyImage = async (imageId: string): Promise<boolean> => {
    const response = await apiFetch(`/users/me/posts/${imageId}`, {
        method: 'DELETE',
    });

    if (response.status === 404) return false;
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    return true;
};
