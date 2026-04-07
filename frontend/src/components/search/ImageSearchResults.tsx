import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { searchHashtags } from '../../api/hashtags/hashtagsService.ts';

const MAX_RESULT_QUANTITY = 5;

type Props = {
    postResults: string;
};

export default function ImageSearchResults({ postResults }: Props) {
    const navigate = useNavigate();
    const [matchingHashtags, setMatchingHashtags] = useState<string[]>([]);

    const trimmedQuery = postResults.trim();

    useEffect(() => {
        let ignore = false;

        if (!trimmedQuery) {
            setMatchingHashtags([]);
            return;
        }

        searchHashtags(trimmedQuery, MAX_RESULT_QUANTITY)
            .then((result) => {
                if (!ignore) setMatchingHashtags(result);
            })
            .catch(() => {});

        return () => {
            ignore = true;
        };
    }, [trimmedQuery]);

    return (
        <>
            <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Search posts
                </div>
                <button
                    type="button"
                    className="w-full flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Search images by description"
                    disabled={!trimmedQuery}
                    onClick={() =>
                        navigate(
                            `/Search/results?q=${encodeURIComponent(trimmedQuery)}&tab=images`,
                        )
                    }
                >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 text-base">
                        🔍
                    </span>
                    <div className="text-left min-w-0">
                        <div className="font-medium text-sm truncate">
                            {trimmedQuery}
                        </div>
                        <div className="text-xs text-gray-500">
                            Search by description
                        </div>
                    </div>
                </button>
            </div>

            <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hashtags
                </div>
                <button
                    type="button"
                    className="w-full flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!trimmedQuery}
                    onClick={() =>
                        navigate(
                            `/Search/results?q=${encodeURIComponent(trimmedQuery)}&tab=hashtags`,
                        )
                    }
                >
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 font-bold text-sm">
                        #
                    </span>
                    <div className="text-left min-w-0">
                        <div className="font-medium text-sm truncate">
                            {trimmedQuery}
                        </div>
                        <div className="text-xs text-gray-500">
                            {!trimmedQuery
                                ? 'Search by hashtag'
                                : matchingHashtags.length > 0
                                  ? `Search all for "${trimmedQuery}"`
                                  : 'No hashtags found'}
                        </div>
                    </div>
                </button>
                {matchingHashtags.length > 0 &&
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
                    ))}
            </div>
        </>
    );
}
