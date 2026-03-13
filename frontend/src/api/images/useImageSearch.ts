import { useEffect, useMemo, useState } from 'react';

import type { ImageDetails } from '../../types/image';
import { apiGetJsonOrUndefinedOn404 } from '../http';
import { mapPostResponseToImageDetails } from './imagesMappers';
import type { PostResponseDto } from './imagesResponses';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useImageSearchByHashtag(hashtag: string) {
    const [status, setStatus] = useState<Status>('idle');
    const [images, setImages] = useState<ImageDetails[]>([]);

    const normalizedHashtag = useMemo(() => hashtag.trim(), [hashtag]);

    useEffect(() => {
        let ignore = false;

        if (!normalizedHashtag) {
            setImages([]);
            setStatus('idle');
            return;
        }

        const fetchImages = async () => {
            setStatus('loading');
            const posts = await apiGetJsonOrUndefinedOn404<PostResponseDto[]>(
                `/posts?hashtag=${encodeURIComponent(normalizedHashtag)}`,
            );
            if (ignore) return;
            if (!posts) {
                setImages([]);
                setStatus('success');
                return;
            }
            setImages(posts.map(mapPostResponseToImageDetails));
            setStatus('success');
        };

        fetchImages().catch(() => {
            if (!ignore) setStatus('error');
        });

        return () => {
            ignore = true;
        };
    }, [normalizedHashtag]);

    return { status, images };
}

export function useImageSearchByDescription(query: string) {
    const [status, setStatus] = useState<Status>('idle');
    const [images, setImages] = useState<ImageDetails[]>([]);

    const normalizedQuery = useMemo(() => query.trim(), [query]);

    useEffect(() => {
        let ignore = false;

        if (!normalizedQuery) {
            setImages([]);
            setStatus('idle');
            return;
        }

        const fetchImages = async () => {
            setStatus('loading');
            const posts = await apiGetJsonOrUndefinedOn404<PostResponseDto[]>(
                `/posts?q=${encodeURIComponent(normalizedQuery)}`,
            );
            if (ignore) return;
            if (!posts) {
                setImages([]);
                setStatus('success');
                return;
            }
            setImages(posts.map(mapPostResponseToImageDetails));
            setStatus('success');
        };

        fetchImages().catch(() => {
            if (!ignore) {
                setStatus('error');
            }
        });

        return () => {
            ignore = true;
        };
    }, [normalizedQuery]);

    return {
        status,
        images,
        hasQuery: normalizedQuery.length > 0,
    };
}
