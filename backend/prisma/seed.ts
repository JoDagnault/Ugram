import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

type PrismaPgPool = ConstructorParameters<typeof PrismaPg>[0];

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool as unknown as PrismaPgPool);
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

    await prisma.post.upsert({
        where: { id: '1f518f0a-5ee1-4f06-81b4-353b762415d4' },
        update: {},
        create: {
            id: '1f518f0a-5ee1-4f06-81b4-353b762415d4',
            authorId: ME_USER_ID,
            imageURL: 'https://picsum.photos/seed/img-3/800/600',
            description: 'Little drive to see the wind turbines',
            hashtags: ['HondaCivicForLife', 'KevinInTheDesert'],
            mentions: [CHARLIE_USER_ID],
            createdAt: new Date('2026-02-14T08:30:00.000Z'),
        },
    });

    await prisma.post.upsert({
        where: { id: '84424f89-249d-4978-ac6a-67bcab4b1395' },
        update: {},
        create: {
            id: '84424f89-249d-4978-ac6a-67bcab4b1395',
            authorId: ME_USER_ID,
            imageURL: 'https://picsum.photos/seed/img-1/800/600',
            description: 'Travelling with friends 🏙️',
            hashtags: ['New York', 'Wow'],
            mentions: [],
            createdAt: new Date('2026-01-30T08:30:00.000Z'),
        },
    });

    await prisma.post.upsert({
        where: { id: '3e12a474-c84b-4c94-b81b-da647a6e10c5' },
        update: {},
        create: {
            id: '3e12a474-c84b-4c94-b81b-da647a6e10c5',
            authorId: ME_USER_ID,
            imageURL: 'https://picsum.photos/seed/img-2/600/600',
            description: 'New challenge',
            hashtags: ['Hiking', 'Outdoors'],
            mentions: [ALICE_USER_ID, CHARLIE_USER_ID],
            createdAt: new Date('2025-12-31T08:30:00.000Z'),
        },
    });

    await prisma.post.upsert({
        where: { id: 'c483c9c6-7826-46f7-8ac5-a38e14b6707d' },
        update: {},
        create: {
            id: 'c483c9c6-7826-46f7-8ac5-a38e14b6707d',
            authorId: ALICE_USER_ID,
            imageURL: 'https://picsum.photos/seed/img-4/700/600',
            description: '',
            hashtags: [],
            mentions: [],
            createdAt: new Date('2026-02-05T08:30:00.000Z'),
        },
    });

    await prisma.post.upsert({
        where: { id: 'bc4995c1-18fa-400b-96b6-92be8fea26d5' },
        update: {},
        create: {
            id: 'bc4995c1-18fa-400b-96b6-92be8fea26d5',
            authorId: ALICE_USER_ID,
            imageURL: 'https://picsum.photos/seed/img-5/500/600',
            description: '',
            hashtags: ['Friends'],
            mentions: [],
            createdAt: new Date('2026-01-20T08:30:00.000Z'),
        },
    });

    await prisma.post.upsert({
        where: { id: '376afbab-7a10-4886-a7b9-107af72007c4' },
        update: {},
        create: {
            id: '376afbab-7a10-4886-a7b9-107af72007c4',
            authorId: CHARLIE_USER_ID,
            imageURL: 'https://picsum.photos/seed/img-6/600/600',
            description: 'Good times in Toronto',
            hashtags: [],
            mentions: [ALICE_USER_ID],
            createdAt: new Date('2026-02-07T08:30:00.000Z'),
        },
    });

    console.log('Database seeded successfully!');
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
