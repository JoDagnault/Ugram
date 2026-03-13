import { RevokedTokenRepository } from '../../domain/auth/revoked-token.repository';
import { PrismaClient } from '../../generated/prisma';
import { RevokedToken } from '../../domain/auth/token';

export class PrismaRevokedTokenRepository implements RevokedTokenRepository {
    constructor(private readonly prisma: PrismaClient) {}

    private async deleteExpiredTokens(): Promise<void> {
        await this.prisma.revokedToken.deleteMany({
            where: { expiresAt: { lt: new Date() } },
        });
    }

    async add(revokedToken: RevokedToken): Promise<void> {
        await this.deleteExpiredTokens();
        await this.prisma.revokedToken.create({
            data: {
                token: revokedToken.token,
                expiresAt: revokedToken.expiresAt,
            },
        });
    }

    async exists(token: string): Promise<boolean> {
        await this.deleteExpiredTokens();
        const found = await this.prisma.revokedToken.findUnique({
            where: { token },
        });
        if (!found) {
            return false;
        }

        return true;
    }
}
