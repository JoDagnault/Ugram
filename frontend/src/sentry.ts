import * as Sentry from '@sentry/react';
import { config } from './config';

Sentry.init({
    dsn: config.sentry.DSN,
    sendDefaultPii: true,
    enableLogs: true,
    environment: config.app.MODE,
    beforeSendLog: (log) => {
        if (log.level === 'debug') return null;
        return log;
    },
});
