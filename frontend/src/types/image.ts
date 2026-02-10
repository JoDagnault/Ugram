export type ImageListItem = {
    id: string;
    userId: string;
    imageUrl: string;
    createdAt: string;
};

export type ImageDetailsFields = {
    description: string;
    hashtags: string[];
    mentionUserIds: string[];
};

export type ImageDetails = ImageListItem & ImageDetailsFields;

export type CreateImageRequest = ImageDetailsFields & {
    file: File;
};

export type UpdateImageRequest = Partial<ImageDetailsFields>;
