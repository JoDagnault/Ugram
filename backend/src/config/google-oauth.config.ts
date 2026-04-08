import { OAuth2Client } from 'google-auth-library';
import { config } from './config';

export const googleOAuthClient = new OAuth2Client(
    config.auth.GOOGLE_CLIENT_ID,
    config.auth.GOOGLE_CLIENT_SECRET,
);
