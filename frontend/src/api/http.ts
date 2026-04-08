import { config } from '../config';

const normalizePath = (path: string): string =>
    path.startsWith('/') ? path : `/${path}`;

export const apiUrl = (path: string): string =>
    `${config.api.BASE_URL}${normalizePath(path)}`;

export const apiFetch = async (
    path: string,
    init?: RequestInit,
): Promise<Response> => {
    const token = localStorage.getItem('jwt');

    const response = await fetch(apiUrl(path), {
        ...init,
        headers: {
            ...init?.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (response.status === 401) {
        localStorage.removeItem('jwt');
        window.location.href = '/login';
    }

    return response;
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
