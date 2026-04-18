import { UserProfile } from '../domain/users/user-profile';

export interface GoogleTokenPayload {
    sub: string; // Google user ID
    email: string;
    given_name: string;
    family_name: string;
    picture?: string;
    email_verified: boolean;
}

export interface AuthResponse {
    jwt: string;
    user: UserProfile;
}
