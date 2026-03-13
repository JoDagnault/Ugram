import { AuthResponse, GoogleTokenPayload } from '../../types/auth.types';
import { UserRepository } from '../../domain/users/user.repository';
import { BadRequestError } from '../../errors/bad-request.error';
import { GoogleAuthService } from './google.auth.service';

export class LoginUsecase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly googleAuthService: GoogleAuthService,
    ) {}

    async loginWithGoogle(idToken: string): Promise<AuthResponse> {
        const googleUser: GoogleTokenPayload =
            await this.googleAuthService.verifyGoogleToken(idToken);
        let user = await this.userRepository.findByEmail(googleUser.email);

        if (!user) {
            throw new BadRequestError('No account found');
        }

        const jwt: string = this.googleAuthService.generateAppToken(
            user.id,
            user.email,
        );

        return {
            jwt,
            user,
        };
    }
}
