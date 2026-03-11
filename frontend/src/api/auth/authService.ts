import { apiFetch, handleLoginResponse } from '../http.ts';

export const apiPostJson = async <T>(
    path: string,
    body: unknown,
): Promise<T> => {
    const response = await apiFetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        await handleLoginResponse(response);
        throw new Error(`API request failed (${response.status})`);
    }

    return (await response.json()) as T;
};
