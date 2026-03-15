import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { getFeedImages } from '../../api/images/imagesService';
import type { ImageDetails } from '../../types/image';

const MAX_RESULT_QUANTITY = 5;

type Props = {
    postResults: string;
};

export default function ImageSearchResults({ postResults }: Props) {
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

    const trimmedQuery = postResults.trim();
    const normalizedQuery = useMemo(
        () => trimmedQuery.toLowerCase(),
        [trimmedQuery],
    );

    const matchingHashtags = useMemo(() => {
        if (!normalizedQuery) return [];

        return [
            ...new Set(
                images
                    .flatMap((post) => post.hashtags)
                    .filter((hashtag) =>
                        hashtag.toLowerCase().includes(normalizedQuery),
                    ),
            ),
        ].slice(0, MAX_RESULT_QUANTITY);
    }, [images, normalizedQuery]);

    return (
        <>
            <button
                type="button"
                className="w-full flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20 mb-2"
                title="Search images by description"
                onClick={() =>
                    navigate(
                        `/Search/results?q=${encodeURIComponent(trimmedQuery)}&tab=images`,
                    )
                }
            >
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 text-base">
                    🔍
                </span>
                <div className="text-left">
                    <div className="font-medium text-sm">{trimmedQuery}</div>
                    <div className="text-xs text-gray-500">
                        Search by description
                    </div>
                </div>
            </button>

            <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hashtags
                </div>
                {matchingHashtags.length === 0 ? (
                    <p className="text-sm text-gray-500">No hashtags found</p>
                ) : (
                    matchingHashtags.map((hashtag) => (
                        <Link
                            key={hashtag}
                            to={`/Search/results?q=${encodeURIComponent(hashtag)}&tab=hashtags`}
                            className="flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 font-bold text-sm">
                                #
                            </span>
                            <span className="font-medium text-sm">
                                {hashtag}
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </>
    );
}
