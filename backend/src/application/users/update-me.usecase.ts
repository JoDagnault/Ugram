import { UserRepository } from '../../domain/users/user.repository';
import { UpdateMeDto } from '../../api/users/dto/update-me.dto';
import { UserProfile } from '../../domain/users/user-profile';

export class UpdateMeUsecase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(userId: string, fields: UpdateMeDto): Promise<UserProfile> {
        const user = await this.userRepository.getById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const updated = new UserProfile(
            user.id,
            fields.profilePictureUrl ?? user.profilePictureUrl,
            fields.username ?? user.username,
            fields.firstName ?? user.firstName,
            fields.lastName ?? user.lastName,
            fields.email ?? user.email,
            fields.phoneNumber ?? user.phoneNumber,
            user.createdAt,
        );

        await this.userRepository.update(updated);
        return updated;
    }
}
