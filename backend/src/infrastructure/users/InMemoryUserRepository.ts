import { UserProfile } from '../../domain/users/UserProfile';
import type { UserRepository } from '../../domain/users/UserRepository';

export const ME_USER_ID = '21550515-d7c8-4fae-a759-7dfb437c8442';
export const ALICE_USER_ID = '8c1b9c62-2f0d-4f21-9a76-8c0a1f0e6a11';
export const CHARLIE_USER_ID = '3b6e2d8a-6d2a-4d8f-b0d9-7e7d8b2a4f22';

const SEED_USERS: UserProfile[] = [
    new UserProfile(
        ME_USER_ID,
        'https://picsum.photos/id/0/200',
        'BobTheBuilder',
        'Bob',
        'LeBricoleur',
        '2026-01-15T14:10:00.000Z',
    ),
    new UserProfile(
        ALICE_USER_ID,
        'https://picsum.photos/id/10/200',
        'AliceInCodeLand',
        'Alice',
        'Tremblay',
        '2026-01-10T09:30:00.000Z',
    ),
    new UserProfile(
        CHARLIE_USER_ID,
        'https://picsum.photos/id/12/200',
        'CharlieTech',
        'Charlie',
        'Gagnon',
        '2026-01-05T16:45:00.000Z',
    ),
];

export class InMemoryUserRepository implements UserRepository {
    private readonly usersById: Map<string, UserProfile>;

    constructor(seedUsers: UserProfile[] = SEED_USERS) {
        this.usersById = new Map(seedUsers.map((user) => [user.id, user]));
    }

    async getById(id: string): Promise<UserProfile | undefined> {
        return this.usersById.get(id);
    }
}
