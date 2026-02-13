import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

let prisma: PrismaClient | null = null;
let pool: Pool | null = null;

function createPool(): Pool {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined');
    }

    const url = new URL(databaseUrl);

    return new Pool({
        host: url.hostname,
        port: parseInt(url.port) || 5432,
        database: url.pathname.slice(1),
        user: url.username,
        password: url.password,
    });
}

export function getPrismaClient(): PrismaClient {
    if (!prisma) {
        pool = createPool();
        prisma = new PrismaClient({
            adapter: new PrismaPg(pool),
        });
    }

    return prisma;
}
