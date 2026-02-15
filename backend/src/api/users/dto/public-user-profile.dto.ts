export class PublicUserProfileDTO {
    constructor(
        readonly id: string,
        readonly profilePictureUrl: string,
        readonly username: string,
        readonly createdAt: string,
    ) {}
}
