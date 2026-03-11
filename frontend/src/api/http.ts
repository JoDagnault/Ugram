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
): Promise<Response> => {
    const token = localStorage.getItem('jwt');

    return fetch(apiUrl(path), {
        ...init,
        headers: {
            ...init?.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
};

export class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

const extractApiError = async (response: Response): Promise<ApiError> => {
    try {
        const errorData = await response.clone().json();
        const message = errorData.message || `Error ${response.status}`;
        return new ApiError(response.status, message);
    } catch {
        return new ApiError(
            response.status,
            `API request failed (${response.status})`,
        );
    }
};

export const apiGetJsonOrUndefinedOn404 = async <T>(
    path: string,
): Promise<T | undefined> => {
    const response = await apiFetch(path);

    if (response.status === 404) return undefined;
    if (!response.ok) throw await extractApiError(response);

    return (await response.json()) as T;
};

export const handleLoginResponse = async (
    response: Response,
): Promise<void> => {
    throw await extractApiError(response);
};

export const handleErrorResponse = async (
    response: Response,
): Promise<void> => {
    const error = await extractApiError(response);
    alert(`Error ${error.status}: ${error.message}`);
};
