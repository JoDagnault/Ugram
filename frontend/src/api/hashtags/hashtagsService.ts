import { apiGetJsonOrUndefinedOn404 } from '../http';

export type PopularHashtag = {
    name: string;
    count: number;
};

export async function getPopularHashtags(
    limit: number = 10,
): Promise<PopularHashtag[]> {
    const response = await apiGetJsonOrUndefinedOn404<PopularHashtag[]>(
        `/posts/hashtags/popular?limit=${limit}`,
    );

    return response ?? [];
}

export async function searchHashtags(
    query: string,
    limit: number = 20,
): Promise<string[]> {
    if (!query.trim()) return [];

    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', String(limit));

    const hashtags = await apiGetJsonOrUndefinedOn404<PopularHashtag[]>(
        `/posts/hashtags/search?${params.toString()}`,
    );

    return hashtags?.map((tag) => tag.name) ?? [];
}
