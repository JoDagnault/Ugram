import type { MyUser, UserListItem, UserProfile } from '../../types/user.ts';
import { apiFetch, apiGetJsonOrUndefinedOn404 } from '../http.ts';

export const getMe = async (): Promise<MyUser> => {
    const me = await apiGetJsonOrUndefinedOn404<MyUser>('/users/me');
    if (!me) {
        throw new Error('API request failed (404)');
    }

    return me;
};

export const updateMe = async (newMe: MyUser): Promise<MyUser> => {
    const response = await apiFetch('/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMe),
    });

    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    return (await response.json()) as MyUser;
};

export const getUsers = async (): Promise<UserListItem[]> => {
    const users = await apiGetJsonOrUndefinedOn404<UserListItem[]>('/users');
    return users ?? [];
};

export const getUser = async (id: string): Promise<UserProfile | undefined> =>
    await apiGetJsonOrUndefinedOn404<UserProfile>(`/users/${id}`);
