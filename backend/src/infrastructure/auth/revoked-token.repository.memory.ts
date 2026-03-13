import { RevokedTokenRepository } from '../../domain/auth/revoked-token.repository';
import { RevokedToken } from '../../domain/auth/token';

export class InMemoryRevokedTokenRepository implements RevokedTokenRepository {
    private tokens: Map<string, RevokedToken> = new Map<string, RevokedToken>();

    private deleteExpiredTokens() {
        const now = new Date();
        this.tokens.forEach((revokedToken, token) => {
            if (revokedToken.expiresAt < now) {
                this.tokens.delete(token);
            }
        });
    }

    async add(revokedToken: RevokedToken): Promise<void> {
        this.deleteExpiredTokens();
        this.tokens.set(revokedToken.token, revokedToken);
    }

    async exists(token: string): Promise<boolean> {
        this.deleteExpiredTokens();
        return this.tokens.has(token);
    }
}
