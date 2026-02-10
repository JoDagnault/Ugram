import type { UserProfile } from '../../domain/users/UserProfile';
import type { UserRepository } from '../../domain/users/UserRepository';

export class GetMe {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(userId: string): Promise<UserProfile | undefined> {
        return this.userRepository.getById(userId);
    }
}
