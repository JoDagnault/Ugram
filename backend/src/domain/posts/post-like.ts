export class PostLike {
    constructor(
        private readonly _id: string,
        private readonly _from: string,
        private readonly _createdAt: string = new Date().toISOString(),
    ) {}

    get id(): string {
        return this._id;
    }

    get from() {
        return this._from;
    }

    get createdAt(): string {
        return this._createdAt;
    }
}
