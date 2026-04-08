import type { UserListItem } from '../types/user.ts';
import { useEffect, useState } from 'react';
import { getUsers } from '../api/users/usersService.ts';

let cache: UserListItem[] | null = null;
let promise: Promise<UserListItem[]> | null = null;

export function useUsers() {
    const [users, setUsers] = useState<UserListItem[]>(cache ?? []);

    useEffect(() => {
        if (cache) return;

        if (!promise) {
            promise = getUsers().catch(() => []);
        }

        promise.then((data) => {
            cache = data;
            setUsers(data);
        });
    }, []);

    return users;
}
