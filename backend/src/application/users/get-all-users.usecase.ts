import type { UserProfile } from '../../domain/users/user-profile';
import type { UserRepository } from '../../domain/users/user.repository';

export class GetAllUsersUsecase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(): Promise<UserProfile[]> {
        return this.userRepository.getAll();
    }
}
