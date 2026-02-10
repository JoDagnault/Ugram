import type { UserProfile } from './UserProfile';

export interface UserRepository {
    getById(id: string): Promise<UserProfile | undefined>;
    getAll(): Promise<UserProfile[]>;
}
