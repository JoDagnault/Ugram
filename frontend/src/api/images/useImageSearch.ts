import { useEffect, useMemo, useRef, useState } from 'react';

import type { ImageDetails } from '../../types/image';
import { apiGetJsonOrUndefinedOn404 } from '../http';
import { mapPostResponseToImageDetails } from './imagesMappers';
import type { PostResponseDto } from './imagesResponses';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useImageSearchByHashtag(hashtag: string) {
    const [status, setStatus] = useState<Status>('idle');
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [hasMore, setHasMore] = useState(false);

    const normalizedHashtag = useMemo(() => hashtag.trim(), [hashtag]);

    const pageRef = useRef(1);
    const hasMoreRef = useRef(false);
    const isLoadingMore = useRef(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const loadMore = useRef(async (tag: string, page: number) => {
        if (isLoadingMore.current || !hasMoreRef.current) return;
        isLoadingMore.current = true;
        try {
            const res = await apiGetJsonOrUndefinedOn404<{
                data: PostResponseDto[];
                hasMore: boolean;
            }>(
                `/posts?hashtag=${encodeURIComponent(tag)}&page=${page}&limit=20`,
            );
            if (!res) return;
            setImages((prev) => [
                ...prev,
                ...res.data.map(mapPostResponseToImageDetails),
            ]);
            hasMoreRef.current = res.hasMore;
            setHasMore(res.hasMore);
            pageRef.current = page;
        } finally {
            isLoadingMore.current = false;
        }
    });

    useEffect(() => {
        let ignore = false;

        if (!normalizedHashtag) {
            setImages([]);
            setStatus('idle');
            setHasMore(false);
            return;
        }

        const fetchImages = async () => {
            setStatus('loading');
            setImages([]);
            pageRef.current = 1;
            hasMoreRef.current = false;

            const res = await apiGetJsonOrUndefinedOn404<{
                data: PostResponseDto[];
                hasMore: boolean;
            }>(
                `/posts?hashtag=${encodeURIComponent(normalizedHashtag)}&page=1&limit=20`,
            );
            if (ignore) return;
            if (!res) {
                setStatus('success');
                return;
            }

            setImages(res.data.map(mapPostResponseToImageDetails));
            hasMoreRef.current = res.hasMore;
            setHasMore(res.hasMore);
            setStatus('success');
        };

        fetchImages().catch(() => {
            if (!ignore) setStatus('error');
        });
        return () => {
            ignore = true;
        };
    }, [normalizedHashtag]);

    useEffect(() => {
        if (status !== 'success' || !loaderRef.current) return;
        const node = loaderRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting)
                    loadMore.current(normalizedHashtag, pageRef.current + 1);
            },
            { threshold: 0.1 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [status, normalizedHashtag]);

    return { status, images, hasMore, loaderRef };
}

export function useImageSearchByDescription(query: string) {
    const [status, setStatus] = useState<Status>('idle');
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [hasMore, setHasMore] = useState(false);

    const normalizedQuery = useMemo(() => query.trim(), [query]);

    const pageRef = useRef(1);
    const hasMoreRef = useRef(false);
    const isLoadingMore = useRef(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const loadMore = useRef(async (q: string, page: number) => {
        if (isLoadingMore.current || !hasMoreRef.current) return;
        isLoadingMore.current = true;
        try {
            const res = await apiGetJsonOrUndefinedOn404<{
                data: PostResponseDto[];
                hasMore: boolean;
            }>(`/posts?q=${encodeURIComponent(q)}&page=${page}&limit=20`);
            if (!res) return;
            setImages((prev) => [
                ...prev,
                ...res.data.map(mapPostResponseToImageDetails),
            ]);
            hasMoreRef.current = res.hasMore;
            setHasMore(res.hasMore);
            pageRef.current = page;
        } finally {
            isLoadingMore.current = false;
        }
    });

    useEffect(() => {
        let ignore = false;

        if (!normalizedQuery) {
            setImages([]);
            setStatus('idle');
            setHasMore(false);
            return;
        }

        const fetchImages = async () => {
            setStatus('loading');
            setImages([]);
            pageRef.current = 1;
            hasMoreRef.current = false;

            const res = await apiGetJsonOrUndefinedOn404<{
                data: PostResponseDto[];
                hasMore: boolean;
            }>(
                `/posts?q=${encodeURIComponent(normalizedQuery)}&page=1&limit=20`,
            );
            if (ignore) return;
            if (!res) {
                setStatus('success');
                return;
            }

            setImages(res.data.map(mapPostResponseToImageDetails));
            hasMoreRef.current = res.hasMore;
            setHasMore(res.hasMore);
            setStatus('success');
        };

        fetchImages().catch(() => {
            if (!ignore) setStatus('error');
        });
        return () => {
            ignore = true;
        };
    }, [normalizedQuery]);

    useEffect(() => {
        if (status !== 'success' || !loaderRef.current) return;
        const node = loaderRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting)
                    loadMore.current(normalizedQuery, pageRef.current + 1);
            },
            { threshold: 0.1 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [status, normalizedQuery]);

    return {
        status,
        images,
        hasMore,
        loaderRef,
        hasQuery: normalizedQuery.length > 0,
    };
}
