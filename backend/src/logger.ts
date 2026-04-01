import winston from 'winston';
import { config } from './config/config';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const metaStr = Object.entries(meta)
            .map(([k, v]) => `${k}=${v}`)
            .join(' ');
        return `${timestamp} [${level}] ${message} ${metaStr}`.trim();
    }),
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
];

export const logger = winston.createLogger({
    level: config.logging.LEVEL,
    levels,
    format,
    transports,
});
