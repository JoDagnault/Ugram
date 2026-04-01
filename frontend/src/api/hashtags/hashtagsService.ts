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
