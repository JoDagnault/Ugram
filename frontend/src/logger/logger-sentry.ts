import * as Sentry from '@sentry/react';
import type { Logger } from './logger.interface.ts';

export class SentryLogger implements Logger {
    debug(message: string, context?: Record<string, unknown>): void {
        Sentry.logger.debug(message, context);
    }

    info(message: string, context?: Record<string, unknown>): void {
        Sentry.logger.info(message, context);
    }

    warn(message: string, context?: Record<string, unknown>): void {
        Sentry.logger.warn(message, context);
    }

    error(
        message: string,
        error?: unknown,
        context?: Record<string, unknown>,
    ): void {
        Sentry.logger.error(message, {
            ...context,
            ...(error instanceof Error && {
                errorMessage: error.message,
                errorStack: error.stack,
            }),
        });

        if (error instanceof Error) {
            Sentry.captureException(error);
        }
    }
}
