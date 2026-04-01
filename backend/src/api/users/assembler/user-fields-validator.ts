import { z } from 'zod';
import { BadRequestError } from '../../../errors/bad-request.error';
import { UpdateMeDto } from '../dto/update-me.dto';

const UpdateMeSchema = z.object({
    username: z
        .string()
        .trim()
        .min(1, 'Username cannot be empty')
        .regex(/^\S+$/, 'Username cannot contain spaces')
        .optional(),
    firstName: z
        .string()
        .trim()
        .min(1, 'First name cannot be empty')
        .optional(),
    lastName: z.string().trim().min(1, 'Last name cannot be empty').optional(),
    email: z.email('Invalid email format').optional(),
    phoneNumber: z
        .string()
        .regex(/^[0-9+\-\s()]{7,20}$/, 'Invalid phone number format')
        .optional(),
});

export class UserValidator {
    static validateUser(fields: UpdateMeDto): void {
        const result = UpdateMeSchema.safeParse(fields);
        if (!result.success) {
            throw new BadRequestError(result.error.issues[0].message);
        }
    }
}
