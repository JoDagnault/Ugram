import { RevokedTokenRepository } from '../../domain/auth/revoked-token.repository';
import { RevokedToken } from '../../domain/auth/token';

export class LogoutUsecase {
    constructor(private revokedTokenRepository: RevokedTokenRepository) {}

    async logout(revokedToken: RevokedToken): Promise<void> {
        await this.revokedTokenRepository.add(revokedToken);
    }
}
