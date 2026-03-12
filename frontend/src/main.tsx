import './sentry.ts';
import * as Sentry from '@sentry/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router';
import router from './router.tsx';

const root = createRoot(document.getElementById('root')!, {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
});

root.render(
    <StrictMode>
        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            locale="en"
        >
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </StrictMode>,
);
