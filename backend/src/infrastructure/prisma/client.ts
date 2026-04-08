import { PrismaClient } from '../../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../../config/config';

type PrismaPgPool = ConstructorParameters<typeof PrismaPg>[0];

let prisma: PrismaClient | null = null;
let pool: Pool | null = null;

function createPool(): Pool {
    return new Pool({
        connectionString: config.database.URL,
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
