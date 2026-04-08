export class PostComment {
    constructor(
        private readonly _id: string,
        private _comment: string,
        private readonly _from: string,
        private readonly _createdAt: string = new Date().toISOString(),
    ) {}
    get id(): string {
        return this._id;
    }

    get comment(): string {
        return this._comment;
    }

    get from(): string {
        return this._from;
    }

    get createdAt(): string {
        return this._createdAt;
    }
}
