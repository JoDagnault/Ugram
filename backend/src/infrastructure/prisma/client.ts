import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

type PrismaPgPool = ConstructorParameters<typeof PrismaPg>[0];

let prisma: PrismaClient | null = null;
let pool: Pool | null = null;

function createPool(): Pool {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined');
    }

    return new Pool({
        connectionString: databaseUrl,
    });
}

export function getPrismaClient(): PrismaClient {
    if (!prisma) {
        pool = createPool();
        prisma = new PrismaClient({
            adapter: new PrismaPg(pool as unknown as PrismaPgPool),
        });
    }

    return prisma;
}
