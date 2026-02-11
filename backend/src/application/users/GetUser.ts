import type { UserProfile } from '../../domain/users/UserProfile';
import type { UserRepository } from '../../domain/users/user.repository';

export class GetUser {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<UserProfile | undefined> {
        return this.userRepository.getById(id);
    }
}
