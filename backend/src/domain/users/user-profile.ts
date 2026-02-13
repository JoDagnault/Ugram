export class UserProfile {
    constructor(
        readonly id: string,
        readonly profilePictureUrl: string,
        readonly username: string,
        readonly firstName: string,
        readonly lastName: string,
        readonly email: string,
        readonly phoneNumber: string,
        readonly createdAt: Date,
    ) {
        if (!id) throw new Error('User id is required');
        if (!username) throw new Error('Username is required');

        if (!firstName || firstName.trim().length === 0) {
            throw new Error('First name is required');
        }

        if (!lastName || lastName.trim().length === 0) {
            throw new Error('Last name is required');
        }

        if (!email || !email.includes('@')) {
            throw new Error('Invalid email');
        }

        if (phoneNumber && !phoneNumber.match(/^[0-9+\-\s()]{7,20}$/)) {
            throw new Error('Invalid phone number');
        }
    }
}
