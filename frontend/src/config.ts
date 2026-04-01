const DEFAULT_API_BASE_URL = 'http://localhost:3000';
const DEFAULT_MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

export const config = {
    api: {
        BASE_URL: (import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL)
            .trim()
            .replaceAll(/\/+$/g, ''),
    },
    auth: {
        GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    },
    uploads: {
        MAX_IMAGE_SIZE_BYTES: Number(
            import.meta.env.VITE_MAX_IMAGE_SIZE_BYTES ??
                DEFAULT_MAX_IMAGE_SIZE_BYTES,
        ),
    },
    sentry: {
        DSN: import.meta.env.VITE_SENTRY_DSN,
    },
    analytics: {
        GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID?.trim(),
    },
    app: {
        MODE: import.meta.env.MODE,
    },
};
