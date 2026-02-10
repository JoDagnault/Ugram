import type { UserProfile } from '../../domain/users/UserProfile';
import type { UserRepository } from '../../domain/users/UserRepository';

export class GetAllUsers {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<UserProfile[]> {
        return this.userRepository.getAll();
    }
}
