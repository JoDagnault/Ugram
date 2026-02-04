export class UserProfile {
    constructor(
        readonly id: string,
        readonly profilePictureUrl: string,
        readonly username: string,
        readonly firstName: string,
        readonly lastName: string,
        readonly createdAt: string,
    ) {}
}
