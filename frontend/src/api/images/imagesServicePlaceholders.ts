import type {
    CreateImageRequest,
    ImageDetails,
    ImageListItem,
    UpdateImageRequest,
} from '../../types/image.ts';
import {
    ALICE_USER_ID,
    ME_USER_ID,
} from '../users/usersServicePlaceholders.ts';

const toImageListItem = ({
    id,
    userId,
    imageUrl,
    createdAt,
}: ImageDetails): ImageListItem => ({ id, userId, imageUrl, createdAt });

const sortByCreatedAtDesc = (a: ImageDetails, b: ImageDetails): number =>
    b.createdAt.localeCompare(a.createdAt);

let images: ImageDetails[] = [
    {
        id: 'img-1',
        userId: ME_USER_ID,
        imageUrl: 'https://picsum.photos/seed/img-1/600/600',
        createdAt: '2026-01-02T00:00:00.000Z',
        description: '',
        hashtags: [],
        mentionUserIds: [],
    },
    {
        id: 'img-2',
        userId: ALICE_USER_ID,
        imageUrl: 'https://picsum.photos/seed/img-2/600/600',
        createdAt: '2026-01-01T00:00:00.000Z',
        description: '',
        hashtags: [],
        mentionUserIds: [],
    },
];

export const getUserImagesPlaceholder = (userId: string): ImageListItem[] =>
    images
        .filter((image) => image.userId === userId)
        .sort(sortByCreatedAtDesc)
        .map(toImageListItem);

export const getFeedImagesPlaceholder = (): ImageDetails[] =>
    [...images].sort(sortByCreatedAtDesc);

export const getImagePlaceholder = (
    imageId: string,
): ImageDetails | undefined => images.find((image) => image.id === imageId);

export const createMyImagePlaceholder = (
    input: CreateImageRequest,
): ImageDetails => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const imageUrl = input.file
        ? URL.createObjectURL(input.file)
        : `https://picsum.photos/seed/${id}/600/600`;

    const created: ImageDetails = {
        id,
        userId: ME_USER_ID,
        imageUrl,
        createdAt,
        description: input.description,
        hashtags: input.hashtags,
        mentionUserIds: input.mentionUserIds,
    };

    images = [created, ...images];
    return created;
};

export const updateMyImagePlaceholder = (
    imageId: string,
    update: UpdateImageRequest,
): ImageDetails | undefined => {
    let updated: ImageDetails | undefined;

    images = images.map((image) => {
        if (image.id !== imageId) return image;

        updated = {
            ...image,
            description: update.description ?? image.description,
            hashtags: update.hashtags ?? image.hashtags,
            mentionUserIds: update.mentionUserIds ?? image.mentionUserIds,
        };

        return updated;
    });

    return updated;
};

export const deleteMyImagePlaceholder = (imageId: string): boolean => {
    const image = images.find((existing) => existing.id === imageId);
    if (!image || image.userId !== ME_USER_ID) return false;

    images = images.filter((existing) => existing.id !== imageId);
    return true;
};
