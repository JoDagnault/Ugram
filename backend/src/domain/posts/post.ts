import { PostComment } from './post-comment';
import { PostLike } from './post-like';
import { NotFoundError } from '../../errors/not-found.error';
import { BadRequestError } from '../../errors/bad-request.error';

export class Post {
    constructor(
        private readonly _id: string,
        private readonly _userId: string,
        private _imageURL: string,
        private _description: string,
        private _hashtags: string[],
        private _mentions: string[],
        private _comments: PostComment[],
        private _likes: PostLike[],
        private readonly _createdAt: string = new Date().toISOString(),
        private _likesCount: number = 0,
        private _isLikedByMe: boolean = false,
    ) {}

    get id(): string {
        return this._id;
    }

    get userId(): string {
        return this._userId;
    }

    get imageURL(): string {
        return this._imageURL;
    }

    get description(): string {
        return this._description;
    }

    get hashtags(): string[] {
        return this._hashtags;
    }

    get mentions(): string[] {
        return this._mentions;
    }

    get comments(): PostComment[] {
        return this._comments;
    }

    get likes(): PostLike[] {
        return this._likes;
    }

    get createdAt(): string {
        return this._createdAt;
    }

    get likesCount(): number {
        return this._likesCount;
    }

    get isLikedByMe(): boolean {
        return this._isLikedByMe;
    }

    updateFields(fields: {
        description?: string;
        hashtags?: string[];
        mentions?: string[];
    }): void {
        if (fields.description !== undefined) {
            this._description = fields.description;
        }
        if (fields.hashtags !== undefined) {
            this._hashtags = fields.hashtags;
        }
        if (fields.mentions !== undefined) {
            this._mentions = fields.mentions;
        }
    }

    addComment(comment: PostComment) {
        this._comments.push(comment);
    }

    addLike(like: PostLike) {
        const alreadyLiked: boolean = this._likes.some(
            (l) => l.from === like.from,
        );
        if (alreadyLiked)
            throw new BadRequestError('User already liked this post');
        this._likes.push(like);
    }

    deleteComment(commentId: string) {
        const index: number = this._comments.findIndex(
            (c) => c.id === commentId,
        );
        if (index === -1) throw new NotFoundError('Comment not found');
        this._comments.splice(index, 1);
    }

    deleteLike(userId: string) {
        const index: number = this._likes.findIndex((l) => l.from === userId);
        if (index === -1) throw new NotFoundError('Like not found');
        this._likes.splice(index, 1);
    }
}
