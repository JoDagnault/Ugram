import type { UserProfile } from '../../domain/users/user-profile';
import type { UserRepository } from '../../domain/users/user.repository';
import { PrismaUserRepository } from '../../infrastructure/users/PrismaUserRepository';

export class GetUserUsecase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(id: string): Promise<UserProfile | undefined> {
        return this.userRepository.getById(id);
    }
}
