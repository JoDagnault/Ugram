import type {
    CreateImageRequest,
    ImageDetails,
    UpdateImageRequest,
} from '../../types/image.ts';
import {
    apiFetch,
    apiGetJsonOrUndefinedOn404,
    handleErrorResponse,
} from '../http.ts';
import { mapPostResponseToImageDetails } from './imagesMappers.ts';
import type { PostResponseDto } from './imagesResponses.ts';
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

export type PostPreview = {
    id: string;
    imageURL: string;
    description: string;
};

export const searchPostsByDescriptionPreview = async (
    query: string,
    limit: number = 5,
): Promise<PostPreview[]> => {
    if (!query.trim()) return [];

    const params = new URLSearchParams({
        q: query,
        page: '1',
        limit: String(limit),
    });
    const res = await apiGetJsonOrUndefinedOn404<{
        data: PostResponseDto[];
        hasMore: boolean;
    }>(`/posts?${params.toString()}`);

    return (
        res?.data.map((p) => ({
            id: p.id,
            imageURL: p.imageURL,
            description: p.description,
        })) ?? []
    );
};

export const getUserImages = async (
    userId: string,
    page: number = 1,
): Promise<{ images: ImageDetails[]; hasMore: boolean }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '20');

    const res = await apiGetJsonOrUndefinedOn404<{
        data: PostResponseDto[];
        hasMore: boolean;
    }>(`/users/${userId}/posts?${params.toString()}`);

    if (!res) return { images: [], hasMore: false };
    return {
        images: res.data.map(mapPostResponseToImageDetails),
        hasMore: res.hasMore,
    };
};

export const getFeedImages = async (
    page: number = 1,
    hashtag?: string,
    exactMatch: boolean = false,
): Promise<{ images: ImageDetails[]; hasMore: boolean }> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', '20');
    if (hashtag) params.append('hashtag', hashtag);
    if (exactMatch) params.append('exactMatch', 'true');

    const res = await apiGetJsonOrUndefinedOn404<{
        data: PostResponseDto[];
        hasMore: boolean;
    }>(`/posts?${params.toString()}`);

    if (!res) return { images: [], hasMore: false };
    return {
        images: res.data.map(mapPostResponseToImageDetails),
        hasMore: res.hasMore,
    };
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

export const likeImage = async (imageId: string): Promise<void> => {
    const response = await apiFetch(`/users/me/posts/${imageId}/like`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        await handleErrorResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }
};

export const unlikeImage = async (imageId: string): Promise<void> => {
    const response = await apiFetch(`/users/me/posts/${imageId}/like`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        await handleErrorResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }
};

export const commentImage = async (
    imageId: string,
    comment: string,
): Promise<ImageDetails | undefined> => {
    const response = await apiFetch(`/users/me/posts/${imageId}/comment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
    });

    if (!response.ok) {
        await handleErrorResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }

    const updatedPost = (await response.json()) as PostResponseDto;
    return mapPostResponseToImageDetails(updatedPost);
};

export const uncommentImage = async (
    imageId: string,
    commentId: string,
): Promise<void> => {
    const response = await apiFetch(
        `/users/me/posts/${imageId}/comment/${commentId}`,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        },
    );

    if (!response.ok) {
        await handleErrorResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }
};
