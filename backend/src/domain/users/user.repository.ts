import type { UserProfile } from './user-profile';

export interface UserRepository {
    findById(id: string): Promise<UserProfile>;
    getAll(): Promise<UserProfile[]>;
    update(user: UserProfile): Promise<void>;
    findByEmail(email: string): Promise<UserProfile | undefined>;
    findByUsername(username: string): Promise<UserProfile | undefined>;
    save(user: UserProfile): Promise<void>;
}
