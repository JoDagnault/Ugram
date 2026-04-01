import './sentry.ts';
import * as Sentry from '@sentry/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import ReactGA from 'react-ga4';
import { config } from './config';
import router from './router.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { SentryLogger } from './logger/logger-sentry.ts';
import { LoggerProvider } from './logger/logger.context.tsx';

const root = createRoot(document.getElementById('root')!, {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
});

const logger = new SentryLogger();

if (config.analytics.GA_MEASUREMENT_ID) {
    ReactGA.initialize(config.analytics.GA_MEASUREMENT_ID);
}

root.render(
    <StrictMode>
        <LoggerProvider logger={logger}>
            <GoogleOAuthProvider
                clientId={config.auth.GOOGLE_CLIENT_ID}
                locale="en"
            >
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </GoogleOAuthProvider>
        </LoggerProvider>
    </StrictMode>,
);
