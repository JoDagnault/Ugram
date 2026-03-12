import { apiPostJson } from './authService.ts';

export interface GoogleLoginResponse {
    jwt: string;
    user: {
        id: string;
        email: string;
        name: string;
        picture?: string;
    };
}

export const loginWithGoogle = async (
    token: string,
): Promise<GoogleLoginResponse> =>
    apiPostJson('/auth/login', { idToken: token });

export const registerWithGoogle = async (
    token: string,
    username: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
): Promise<GoogleLoginResponse> =>
    apiPostJson('/auth/register', {
        idToken: token,
        username,
        firstName,
        lastName,
        phoneNumber,
    });
