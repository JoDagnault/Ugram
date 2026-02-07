import type { MyUser, UserListItem, UserProfile } from '../../types/user.ts';

export const ME_USER_ID = '21550515-d7c8-4fae-a759-7dfb437c8442';
export const ALICE_USER_ID = '8c1b9c62-2f0d-4f21-9a76-8c0a1f0e6a11';
export const CHARLIE_USER_ID = '3b6e2d8a-6d2a-4d8f-b0d9-7e7d8b2a4f22';

let me: MyUser = {
    id: ME_USER_ID,
    profilePictureUrl: 'https://picsum.photos/id/0/200',
    username: 'BobTheBuilder',
    firstName: 'Bob',
    lastName: 'LeBricoleur',
    email: 'bob-builder@example.com',
    phone: '514-123-4567',
    createdAt: '2026-01-15T14:10:00.000Z',
};

let users: MyUser[] = [
    me,
    {
        id: ALICE_USER_ID,
        profilePictureUrl: 'https://picsum.photos/id/10/200',
        username: 'AliceInCodeLand',
        firstName: 'Alice',
        lastName: 'Tremblay',
        email: 'alice@example.com',
        phone: '438-555-0123',
        createdAt: '2026-01-10T09:30:00.000Z',
    },
    {
        id: CHARLIE_USER_ID,
        profilePictureUrl: 'https://picsum.photos/id/12/200',
        username: 'CharlieTech',
        firstName: 'Charlie',
        lastName: 'Gagnon',
        email: 'charlie@example.com',
        phone: '514-555-9876',
        createdAt: '2026-01-05T16:45:00.000Z',
    },
];

const toUserProfile = (user: MyUser): UserProfile => ({
    id: user.id,
    profilePictureUrl: user.profilePictureUrl,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
});

const toUserListItem = (user: MyUser): UserListItem => ({
    id: user.id,
    profilePictureUrl: user.profilePictureUrl,
    username: user.username,
});

export const getMePlaceholder = (): MyUser => me;

export const updateMePlaceholder = (nextMe: MyUser): MyUser => {
    me = nextMe;
    users = users.map((user) => (user.id === me.id ? me : user));
    return me;
};

export const getUserPlaceholder = (id: string): UserProfile | undefined => {
    const user = users.find((user) => user.id === id);
    return user ? toUserProfile(user) : undefined;
};

export const getUsersPlaceholder = (): UserListItem[] =>
    users.map(toUserListItem);
