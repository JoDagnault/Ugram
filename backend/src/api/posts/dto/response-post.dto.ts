export class ResponsePostDTO {
    constructor(
        public readonly id: string,
        public readonly authorId: string,
        public readonly imageURL: string,
        public readonly description: string,
        public readonly hashtags: string[],
        public readonly mentions: string[],
        public readonly createdAt: string,
        public readonly isOwner: boolean,
    ) {}
}
