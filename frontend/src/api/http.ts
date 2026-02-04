const DEFAULT_API_BASE_URL = 'http://localhost:3000';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL)
    .trim()
    .replaceAll(/\/+$/g, '');

const normalizePath = (path: string): string =>
    path.startsWith('/') ? path : `/${path}`;

export const apiUrl = (path: string): string =>
    `${API_BASE_URL}${normalizePath(path)}`;

export const apiGetJsonOrUndefinedOn404 = async <T>(
    path: string,
): Promise<T | undefined> => {
    const response = await fetch(apiUrl(path));

    if (response.status === 404) return undefined;
    if (!response.ok) {
        throw new Error(`API request failed (${response.status})`);
    }

    return (await response.json()) as T;
};
