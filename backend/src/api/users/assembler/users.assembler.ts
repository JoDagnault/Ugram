import { UserProfile } from '../../../domain/users/user-profile';
import { PublicUserProfileDTO } from '../dto/public-user-profile.dto';
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

    toPublicProfileDTO(user: UserProfile): PublicUserProfileDTO {
        return new PublicUserProfileDTO(
            user.id,
            user.profilePictureUrl,
            user.username,
            user.createdAt.toISOString(),
        );
    }
}
