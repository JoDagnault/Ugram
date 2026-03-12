import { googleOAuthClient } from '../../config/google-oauth.config';
import { GoogleTokenPayload } from '../../types/auth.types';
import jwt from 'jsonwebtoken';

export class GoogleAuthService {
    async verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
        const ticket = await googleOAuthClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid Google token');

        return payload as unknown as GoogleTokenPayload;
    }

    generateAppToken(userId: string, email: string): string {
        return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
        });
    }
}
