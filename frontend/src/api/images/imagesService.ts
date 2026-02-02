import type {
    CreateImageRequest,
    ImageDetails,
    UpdateImageRequest,
    ImageListItem,
} from '../../types/image.ts';
import {
    createMyImagePlaceholder,
    deleteMyImagePlaceholder,
    getFeedImagesPlaceholder,
    getImagePlaceholder,
    getUserImagesPlaceholder,
    updateMyImagePlaceholder,
} from './imagesServicePlaceholders.ts';

export const getUserImages = async (userId: string): Promise<ImageListItem[]> =>
    getUserImagesPlaceholder(userId);

export const getFeedImages = async (): Promise<ImageDetails[]> =>
    getFeedImagesPlaceholder();

export const getImage = async (
    imageId: string,
): Promise<ImageDetails | undefined> => getImagePlaceholder(imageId);

export const createMyImage = async (
    input: CreateImageRequest,
): Promise<ImageDetails> => createMyImagePlaceholder(input);

export const updateMyImage = async (
    imageId: string,
    update: UpdateImageRequest,
): Promise<ImageDetails | undefined> =>
    updateMyImagePlaceholder(imageId, update);

export const deleteMyImage = async (imageId: string): Promise<boolean> =>
    deleteMyImagePlaceholder(imageId);
