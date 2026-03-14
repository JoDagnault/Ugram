export class Post {
    constructor(
        private readonly _id: string,
        private readonly _userId: string,
        private _imageURL: string,
        private _description: string,
        private _hashtags: string[],
        private _mentions: string[],
        private readonly _createdAt: string = new Date().toISOString(),
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

    get createdAt(): string {
        return this._createdAt;
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
}
