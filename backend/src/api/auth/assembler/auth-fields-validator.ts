import { z } from 'zod';
import { BadRequestError } from '../../../errors/bad-request.error';

const IdTokenSchema = z
    .string()
    .trim()
    .min(1, 'idToken is required')
    .regex(/^\S+$/, 'idToken cannot contain spaces');

const RegisterSchema = z.object({
    idToken: IdTokenSchema,
    username: z
        .string()
        .trim()
        .min(1, 'Username is required')
        .max(30, 'Maximum 30 characters for the username')
        .regex(/^\S+$/, 'Username cannot contain spaces'),
    firstName: z
        .string()
        .trim()
        .min(1, 'First name cannot be empty')
        .max(100, 'Maximum 100 characters for the first name')
        .regex(
            /^[\p{L} -]+$/u,
            'First name can only contain letters, spaces, and hyphens',
        ),
    lastName: z
        .string()
        .trim()
        .min(1, 'Last name cannot be empty')
        .max(100, 'Maximum 100 characters for the last name')
        .regex(
            /^[\p{L} -]+$/u,
            'Last name can only contain letters, spaces, and hyphens',
        ),
    phoneNumber: z
        .string()
        .min(1, 'Phone number cannot be empty')
        .regex(
            /^\d{3}-\d{3}-\d{4}$/,
            'Phone number format must be xxx-xxx-xxxx with only numbers',
        ),
});

const LoginSchema = RegisterSchema.pick({ idToken: true });

export class AuthValidator {
    static validateIdToken(idToken?: string): void {
        const result = IdTokenSchema.safeParse(idToken);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0].message);
        }
    }

    static validateLogin(body: { idToken?: string }): void {
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0].message);
        }
    }

    static validateRegister(body: {
        idToken?: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
    }): void {
        const result = RegisterSchema.safeParse(body);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0].message);
        }
    }
}
