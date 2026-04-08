import 'dotenv/config';
import path from 'path';

function getRequiredString(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`${name} is required`);
    }

    return value;
}

function getRequiredPositiveInteger(name: string): number {
    const value = Number(getRequiredString(name));
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${name} must be a positive integer`);
    }

    return value;
}

function getLogLevel(): string {
    return process.env.LOG_LEVEL?.trim() || 'info';
}

function getUploadDirectory(): string {
    const value = process.env.UPLOAD_DIR?.trim();
    return value ? path.resolve(value) : path.resolve(process.cwd(), 'uploads');
}

export const config = Object.freeze({
    logging: {
        LEVEL: getLogLevel(),
    },
    server: {
        PORT: getRequiredPositiveInteger('PORT'),
    },
    database: {
        URL: getRequiredString('DATABASE_URL'),
    },
    auth: {
        JWT_SECRET: getRequiredString('JWT_SECRET'),
        GOOGLE_CLIENT_ID: getRequiredString('GOOGLE_CLIENT_ID'),
        GOOGLE_CLIENT_SECRET: getRequiredString('GOOGLE_CLIENT_SECRET'),
    },
    aws: {
        REGION: getRequiredString('AWS_REGION'),
        BUCKET_NAME: getRequiredString('AWS_BUCKET_NAME'),
        ACCESS_KEY_ID: getRequiredString('AWS_ACCESS_KEY_ID'),
        SECRET_ACCESS_KEY: getRequiredString('AWS_SECRET_ACCESS_KEY'),
    },
    uploads: {
        MAX_IMAGE_SIZE_BYTES: getRequiredPositiveInteger(
            'MAX_IMAGE_SIZE_BYTES',
        ),
        DIRECTORY: getUploadDirectory(),
    },
});
