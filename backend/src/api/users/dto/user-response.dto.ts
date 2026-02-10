export class UserResponseDTO {
    constructor(
        readonly id: string,
        readonly profilePictureUrl: string,
        readonly username: string,
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly phoneNumber: string | null,
        readonly createdAt: string,
    ) {}
}
