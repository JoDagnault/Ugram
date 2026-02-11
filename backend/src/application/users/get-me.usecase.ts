import type { UserProfile } from '../../domain/users/user-profile';
import type { UserRepository } from '../../domain/users/user.repository';

export class GetMeUsecase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(userId: string): Promise<UserProfile | undefined> {
        return this.userRepository.getById(userId);
    }
}
