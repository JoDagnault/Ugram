export type ImageListItem = {
    id: string;
    userId: string;
    imageUrl: string;
    createdAt: string;
};

export type ImageDetailsFields = {
    description: string;
    hashtags: string[];
    mentions: string[];
    filter?: string;
};

export type ImageDetails = ImageListItem &
    ImageDetailsFields & {
        isOwner: boolean;
        isLiked: boolean;
        likes: { from: string; createdAt: string }[];
        comments: {
            id?: string;
            comment: string;
            from: string;
            createdAt: string;
        }[];
    };
export type CreateImageRequest = ImageDetailsFields & {
    file: File;
};

export type UpdateImageRequest = Partial<ImageDetailsFields>;
