import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const ME_USER_ID = '21550515-d7c8-4fae-a759-7dfb437c8442';
const ALICE_USER_ID = '8c1b9c62-2f0d-4f21-9a76-8c0a1f0e6a11';
const CHARLIE_USER_ID = '3b6e2d8a-6d2a-4d8f-b0d9-7e7d8b2a4f22';

async function main() {
    console.log('Seeding database...');

    await prisma.user.upsert({
        where: { id: ME_USER_ID },
        update: {},
        create: {
            id: ME_USER_ID,
            profilePictureUrl: 'https://picsum.photos/id/0/200',
            username: 'BobTheBuilder',
            firstName: 'Bob',
            lastName: 'LeBricoleur',
            email: 'bob@example.com',
            phoneNumber: '514-123-4567',
            createdAt: new Date('2026-01-15T14:10:00.000Z'),
        },
    });

    await prisma.user.upsert({
        where: { id: ALICE_USER_ID },
        update: {},
        create: {
            id: ALICE_USER_ID,
            profilePictureUrl: 'https://picsum.photos/id/10/200',
            username: 'AliceInCodeLand',
            firstName: 'Alice',
            lastName: 'Tremblay',
            email: 'alice@example.com',
            phoneNumber: '438-555-0123',
            createdAt: new Date('2026-01-10T09:30:00.000Z'),
        },
    });

    await prisma.user.upsert({
        where: { id: CHARLIE_USER_ID },
        update: {},
        create: {
            id: CHARLIE_USER_ID,
            profilePictureUrl: 'https://picsum.photos/id/12/200',
            username: 'CharlieTech',
            firstName: 'Charlie',
            lastName: 'Gagnon',
            email: 'charlie@example.com',
            phoneNumber: '514-555-9876',
            createdAt: new Date('2026-01-05T16:45:00.000Z'),
        },
    });

    console.log('Database seeded successfully!');
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
