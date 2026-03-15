import { googleOAuthClient } from '../../config/google-oauth.config';
import { GoogleTokenPayload } from '../../types/auth.types';
import jwt from 'jsonwebtoken';
import { LoginTicket } from 'google-auth-library';

export class GoogleAuthService {
    async verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
        const ticket: LoginTicket = await googleOAuthClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error('Invalid Google token');

        return payload as unknown as GoogleTokenPayload;
    }

    generateAppToken(userId: string, email: string): string {
        return jwt.sign({ userId, email }, process.env.JWT_SECRET!, {
            expiresIn: '30m',
        });
    }
}
