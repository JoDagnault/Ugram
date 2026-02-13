import { UserProfile } from '../../../domain/users/user-profile';
import { UserResponseDTO } from '../dto/user-response.dto';

export class UsersAssembler {
    toDTO(user: UserProfile): UserResponseDTO {
        return new UserResponseDTO(
            user.id,
            user.profilePictureUrl,
            user.username,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.createdAt.toISOString(),
        );
    }
}
