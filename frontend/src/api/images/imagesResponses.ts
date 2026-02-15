export type PostResponseDto = {
    id: string;
    authorId: string;
    imageURL: string;
    description: string;
    hashtags: string[];
    mentions: string[];
    createdAt: string;
    isOwner: boolean;
};
