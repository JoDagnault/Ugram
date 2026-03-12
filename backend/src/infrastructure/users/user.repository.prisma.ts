import { PrismaClient } from '../../generated/prisma';
import { UserProfile } from '../../domain/users/user-profile';
import type { UserRepository } from '../../domain/users/user.repository';
import { NotFoundError } from '../../errors/not-found.error';

export class PrismaUserRepository implements UserRepository {
    private readonly prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }
    async findByEmail(email: string): Promise<UserProfile | undefined> {
        const user = await this.prisma.user.findFirst({ where: { email } });

        if (!user) {
            return undefined;
        }

        return new UserProfile(
            user.id,
            user.profilePictureUrl,
            user.username,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.createdAt,
        );
    }

    async findByUsername(username: string): Promise<UserProfile | undefined> {
        const user = await this.prisma.user.findFirst({ where: { username } });

        if (!user) {
            return undefined;
        }

        return new UserProfile(
            user.id,
            user.profilePictureUrl,
            user.username,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.createdAt,
        );
    }

    async save(user: UserProfile): Promise<void> {
        await this.prisma.user.create({
            data: {
                id: user.id,
                profilePictureUrl: user.profilePictureUrl,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                createdAt: user.createdAt,
            },
        });
    }

    async findById(id: string): Promise<UserProfile> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        return new UserProfile(
            user.id,
            user.profilePictureUrl,
            user.username,
            user.firstName,
            user.lastName,
            user.email,
            user.phoneNumber,
            user.createdAt,
        );
    }

    async getAll(): Promise<UserProfile[]> {
        const users = await this.prisma.user.findMany();

        return users.map(
            (user) =>
                new UserProfile(
                    user.id,
                    user.profilePictureUrl,
                    user.username,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.phoneNumber,
                    user.createdAt,
                ),
        );
    }

    async update(user: UserProfile): Promise<void> {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                profilePictureUrl: user.profilePictureUrl,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
            },
        });
    }

    async deleteById(id: string): Promise<void> {
        await this.prisma.user.delete({
            where: { id },
        });
    }
}
