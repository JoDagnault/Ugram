import type { UserProfile } from '../../domain/users/user-profile';
import type { UserRepository } from '../../domain/users/user.repository';

export class GetUserUsecase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<UserProfile | undefined> {
        return this.userRepository.findById(id);
    }
}
