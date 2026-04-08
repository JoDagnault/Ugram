import { UserRepository } from '../../domain/users/user.repository';

export class DeleteMeUsecase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(userId: string): Promise<void> {
        await this.userRepository.deleteById(userId);
    }
}
