import { BadRequestError } from '../../../errors/bad-request.error';

export class AuthValidator {
    static validateIdToken(idToken?: string) {
        if (!idToken || idToken.trim().length === 0) {
            throw new BadRequestError('idToken is required');
        }
    }

    static validateUsername(username?: string) {
        if (!username || username.trim().length === 0) {
            throw new BadRequestError('Username is required');
        } else if (username.trim().length > 250) {
            throw new BadRequestError(
                'Maximum 250 characters for the username',
            );
        }
    }

    static validateFirstName(firstName?: string) {
        if (!firstName || firstName.trim().length === 0) {
            throw new BadRequestError('First name cannot be empty');
        } else if (firstName.trim().length > 250) {
            throw new BadRequestError(
                'Maximum 250 characters for the first name',
            );
        } else if (!/^[\p{L} -]+$/u.test(firstName)) {
            throw new BadRequestError(
                'First name can only contain letters, spaces, and hyphens',
            );
        }
    }

    static validateLastName(lastName?: string) {
        if (!lastName || lastName.trim().length === 0) {
            throw new BadRequestError('Last name cannot be empty');
        } else if (lastName.trim().length > 250) {
            throw new BadRequestError(
                'Maximum 250 characters for the last name',
            );
        }
        if (!/^[\p{L} -]+$/u.test(lastName)) {
            throw new BadRequestError(
                'Last name can only contain letters, spaces, and hyphens',
            );
        }
    }

    static validatePhoneNumber(phoneNumber?: string) {
        if (!phoneNumber || phoneNumber.trim().length === 0) {
            throw new BadRequestError('Phone number cannot be empty');
        } else if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
            throw new BadRequestError(
                'Phone number format must be xxx-xxx-xxxx with only numbers',
            );
        }
    }

    static validateLogin(body: { idToken?: string }): void {
        this.validateIdToken(body.idToken);
    }

    static validateRegister(body: {
        idToken?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }): void {
        this.validateIdToken(body.idToken);
        this.validateUsername(body.username);
        this.validateFirstName(body.firstName);
        this.validateLastName(body.lastName);
        this.validatePhoneNumber(body.phoneNumber);
    }
}
