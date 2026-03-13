import * as Sentry from '@sentry/react';

Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: true,
    enableLogs: true,
    environment: import.meta.env.MODE,
    beforeSendLog: (log) => {
        if (log.level === 'debug') return null;
        return log;
    },
});
