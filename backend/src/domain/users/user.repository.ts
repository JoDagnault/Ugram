import type { UserProfile } from './user-profile';

export interface UserRepository {
    getById(id: string): Promise<UserProfile | undefined>;
    getAll(): Promise<UserProfile[]>;
    update(user: UserProfile): Promise<void>;
}
