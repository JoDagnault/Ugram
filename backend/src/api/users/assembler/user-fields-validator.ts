import { UpdateMeDto } from '../dto/update-me.dto';
import { BadRequestError } from '../../../errors/bad-request.error';

export class UserValidator {
    static validateUsername(username?: string) {
        if (username !== undefined && username.trim().length === 0) {
            throw new BadRequestError('Username cannot be empty');
        }
    }

    static validateFirstName(firstName?: string) {
        if (firstName !== undefined && firstName.trim().length === 0) {
            throw new BadRequestError('First name cannot be empty');
        }
    }

    static validateLastName(lastName?: string) {
        if (lastName !== undefined && lastName.trim().length === 0) {
            throw new BadRequestError('Last name cannot be empty');
        }
    }

    static validateEmail(email?: string) {
        if (email === undefined) return;

        const trimmed = email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmed)) {
            throw new BadRequestError('Invalid email format');
        }
    }

    static validatePhoneNumber(phoneNumber?: string) {
        if (
            phoneNumber !== undefined &&
            !phoneNumber.match(/^[0-9+\-\s()]{7,20}$/)
        ) {
            throw new BadRequestError('Invalid phone number format');
        }
    }

    static validateUser(fields: UpdateMeDto): void {
        this.validateUsername(fields.username);
        this.validateFirstName(fields.firstName);
        this.validateLastName(fields.lastName);
        this.validateEmail(fields.email);
        this.validatePhoneNumber(fields.phoneNumber);
    }
}
