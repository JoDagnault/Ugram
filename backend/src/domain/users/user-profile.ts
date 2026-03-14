export class UserProfile {
    constructor(
        readonly _id: string,
        readonly _profilePictureUrl: string,
        readonly _username: string,
        readonly _firstName: string,
        readonly _lastName: string,
        readonly _email: string,
        readonly _phoneNumber: string,
        readonly _createdAt: Date,
    ) {}

    get id(): string {
        return this._id;
    }

    get profilePictureUrl(): string {
        return this._profilePictureUrl;
    }

    get username(): string {
        return this._username;
    }

    get firstName(): string {
        return this._firstName;
    }

    get lastName(): string {
        return this._lastName;
    }

    get email(): string {
        return this._email;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    get createdAt(): Date {
        return this._createdAt;
    }
}
