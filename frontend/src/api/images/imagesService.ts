import type {
    CreateImageRequest,
    ImageDetails,
    UpdateImageRequest,
    ImageListItem,
} from '../../types/image.ts';
import { apiUrl } from '../http.ts';
import {
    deleteMyImagePlaceholder,
    getFeedImagesPlaceholder,
    getImagePlaceholder,
    getUserImagesPlaceholder,
    updateMyImagePlaceholder,
} from './imagesServicePlaceholders.ts';
import { mapPostResponseToImageDetails } from './imagesMappers.ts';
import type { PostResponseDto } from './imagesResponses.ts';

export const getUserImages = async (userId: string): Promise<ImageListItem[]> =>
    getUserImagesPlaceholder(userId);

export const getFeedImages = async (): Promise<ImageDetails[]> =>
    getFeedImagesPlaceholder();

export const getImage = async (
    imageId: string,
): Promise<ImageDetails | undefined> => getImagePlaceholder(imageId);

export const createMyImage = async (
    request: CreateImageRequest,
): Promise<ImageDetails> => {
    const formData = new FormData();
    formData.append('image', request.file);
    formData.append('description', request.description);
    formData.append('hashtags', JSON.stringify(request.hashtags));
    formData.append('mentions', JSON.stringify(request.mentionUserIds));

    const response = await fetch(apiUrl('/posts'), {
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
): Promise<ImageDetails | undefined> =>
    updateMyImagePlaceholder(imageId, update);

export const deleteMyImage = async (imageId: string): Promise<boolean> =>
    deleteMyImagePlaceholder(imageId);
