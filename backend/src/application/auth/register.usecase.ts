import { AuthResponse } from '../../types/auth.types';
import { UserProfile } from '../../domain/users/user-profile';
import { UserRepository } from '../../domain/users/user.repository';
import { ForbiddenError } from '../../errors/forbidden.error';
import { GoogleAuthService } from './google.auth.service';

export class RegisterUsecase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly googleAuthService: GoogleAuthService,
    ) {}

    async registerWithGoogle(
        idToken: string,
        username: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
    ): Promise<AuthResponse> {
        const googleUser =
            await this.googleAuthService.verifyGoogleToken(idToken);

        const [existing, usernameExists] = await Promise.all([
            this.userRepository.findByEmail(googleUser.email),
            this.userRepository.findByUsername(username),
        ]);

        if (existing)
            throw new ForbiddenError(
                'There is already an account for this email',
            );
        if (usernameExists)
            throw new ForbiddenError('Username is already taken');

        const newUser = new UserProfile(
            crypto.randomUUID(),
            googleUser.picture ?? '',
            username,
            firstName,
            lastName,
            googleUser.email,
            phoneNumber,
            new Date(),
        );

        await this.userRepository.save(newUser);
        const token = this.googleAuthService.generateAppToken(
            newUser.id,
            newUser.email,
        );
        return { jwt: token, user: newUser };
    }
}
