export type PostResponseDto = {
    id: string;
    authorId: string;
    imageURL: string;
    description: string;
    hashtags: string[];
    mentions: string[];
    createdAt: string;
    isOwner: boolean;
    isLiked: boolean;
    likes: { from: string; createdAt: string }[];
    comments: {
        id: string;
        comment: string;
        from: string;
        createdAt: string;
    }[];
};
