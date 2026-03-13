import type {
    CreateImageRequest,
    ImageDetails,
    UpdateImageRequest,
    ImageListItem,
} from '../../types/image.ts';
import {
    apiFetch,
    apiGetJsonOrUndefinedOn404,
    handleErrorResponse,
} from '../http.ts';
import { mapPostResponseToImageDetails } from './imagesMappers.ts';
import type { PostResponseDto } from './imagesResponses.ts';

const toImageListItem = (image: ImageDetails): ImageListItem => ({
    id: image.id,
    userId: image.userId,
    imageUrl: image.imageUrl,
    createdAt: image.createdAt,
});

const getCreateImageErrorMessage = async (
    response: Response,
): Promise<string> => {
    try {
        const clonedResponse = response.clone();
        const errorData = (await clonedResponse.json()) as {
            message?: string;
        };

        return errorData.message || `API request failed (${response.status})`;
    } catch {
        return `API request failed (${response.status})`;
    }
};

export const getUserImages = async (
    userId: string,
): Promise<ImageListItem[]> => {
    const posts = await apiGetJsonOrUndefinedOn404<PostResponseDto[]>(
        `/users/${userId}/posts`,
    );

    if (!posts) return [];

    return posts.map(mapPostResponseToImageDetails).map(toImageListItem);
};

export const getImagesByHashtag = async (
    hashtag: string,
): Promise<ImageDetails[]> => {
    const posts = await apiGetJsonOrUndefinedOn404<PostResponseDto[]>(
        `/posts?hashtag=${encodeURIComponent(hashtag)}`,
    );
    if (!posts) return [];
    return posts.map(mapPostResponseToImageDetails);
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
        `/posts/${imageId}`,
    );

    return post ? mapPostResponseToImageDetails(post) : undefined;
};

export const createMyImage = async (
    request: CreateImageRequest,
): Promise<ImageDetails> => {
    const formData = new FormData();
    formData.append('image', request.file);
    formData.append('description', request.description);
    formData.append('hashtags', JSON.stringify(request.hashtags));
    formData.append('mentions', JSON.stringify(request.mentions));

    const response = await apiFetch('/users/me/posts', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(await getCreateImageErrorMessage(response));
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
        await handleErrorResponse(response);
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
        await handleErrorResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }

    return true;
};
