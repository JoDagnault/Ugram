import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { getFeedImages } from '../../api/images/imagesService';
import type { ImageDetails } from '../../types/image';

type Props = {
    query: string;
};

export default function ImageSearchResults({ query }: Props) {
    const navigate = useNavigate();
    const [images, setImages] = useState<ImageDetails[]>([]);

    useEffect(() => {
        let ignore = false;

        getFeedImages()
            .then((result) => {
                if (!ignore) setImages(result);
            })
            .catch(() => {});

        return () => {
            ignore = true;
        };
    }, []);

    const trimmedQuery = query.trim();
    const normalizedQuery = useMemo(
        () => trimmedQuery.toLowerCase(),
        [trimmedQuery],
    );

    const matchingHashtags = useMemo(() => {
        if (!normalizedQuery) return [];

        const seen = new Set<string>();
        const result: string[] = [];

        for (const image of images) {
            for (const hashtag of image.hashtags) {
                const lower = hashtag.toLowerCase();
                if (lower.includes(normalizedQuery) && !seen.has(lower)) {
                    seen.add(lower);
                    result.push(hashtag);
                    if (result.length === 5) return result;
                }
            }
        }

        return result;
    }, [images, normalizedQuery]);

    if (!normalizedQuery) {
        return null;
    }

    return (
        <>
            <div className="mb-4 space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hashtags
                </div>
                {matchingHashtags.length === 0 ? (
                    <p className="text-sm text-gray-500">No hashtags found</p>
                ) : (
                    matchingHashtags.map((hashtag) => (
                        <Link
                            key={hashtag}
                            to={`/image-search?q=${encodeURIComponent(hashtag)}`}
                            className="flex items-center gap-2 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                            <span className="font-medium text-sm">
                                #{hashtag}
                            </span>
                        </Link>
                    ))
                )}
            </div>
            <button
                type="button"
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent px-3 py-1 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-dark"
                title="Search images by description"
                onClick={() =>
                    navigate(
                        `/Search/images?q=${encodeURIComponent(trimmedQuery)}`,
                    )
                }
            >
                <span className="text-xs uppercase tracking-wide">
                    Search images for
                </span>
                <span className="text-sm font-semibold">
                    &quot;{trimmedQuery}&quot;
                </span>
                <span aria-hidden="true" className="text-base">
                    🔍
                </span>
            </button>
        </>
    );
}
