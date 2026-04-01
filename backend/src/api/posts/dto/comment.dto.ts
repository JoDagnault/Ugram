export class CommentDto {
    constructor(
        public readonly comment: string,
        public readonly from?: string,
        public readonly createdAt?: string,
        public readonly id?: string,
    ) {}
}
