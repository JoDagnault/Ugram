import { apiFetch, handleLoginResponse } from '../http.ts';
import type { GoogleLoginResponse } from './googleAuthResponse.ts';

export const apiPostJson = async <T>(
    path: string,
    body: unknown,
): Promise<T> => {
    const token = localStorage.getItem('jwt');
    const response = await apiFetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        await handleLoginResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
};

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

export const logout = async (token: string): Promise<void> =>
    apiPostJson('/auth/logout', { idToken: token });
