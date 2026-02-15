const DEFAULT_API_BASE_URL = 'http://localhost:3000';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL)
    .trim()
    .replaceAll(/\/+$/g, '');

const normalizePath = (path: string): string =>
    path.startsWith('/') ? path : `/${path}`;

export const apiUrl = (path: string): string =>
    `${API_BASE_URL}${normalizePath(path)}`;

export const apiFetch = async (
    path: string,
    init?: RequestInit,
): Promise<Response> => await fetch(apiUrl(path), init);

export const apiGetJsonOrUndefinedOn404 = async <T>(
    path: string,
): Promise<T | undefined> => {
    const response = await apiFetch(path);

    if (response.status === 404) return undefined;
    if (!response.ok) {
        await handleErrorResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }

    return (await response.json()) as T;
};

export const handleErrorResponse = async (
    response: Response,
): Promise<void> => {
    try {
        const clonedResponse = response.clone();
        const errorData = await clonedResponse.json();
        const message = errorData.message || `Error ${response.status}`;

        alert(`Error ${response.status}: ${message}`);
    } catch {
        alert(`Error ${response.status}`);
    }
};
