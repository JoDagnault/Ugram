import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { searchHashtags } from '../../api/hashtags/hashtagsService.ts';
import {
    searchPostsByDescriptionPreview,
    type PostPreview,
} from '../../api/images/imagesService.ts';

const MAX_RESULTS = 5;

type Props = {
    postResults: string;
};

function extractSearchSnippet(
    text: string,
    query: string,
    contextChars = 40,
): string {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text.slice(0, contextChars * 2);

    const start = Math.max(0, idx - contextChars);
    const end = Math.min(text.length, idx + query.length + contextChars);
    const result = text.slice(start, end);

    return (start > 0 ? '…' : '') + result + (end < text.length ? '…' : '');
}

function HighlightFirstMatch({ text, query }: { text: string; query: string }) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-yellow-200 dark:bg-yellow-700 not-italic rounded-sm px-0.5">
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}

export default function ImageSearchResults({ postResults }: Props) {
    const navigate = useNavigate();
    const [matchingPosts, setMatchingPosts] = useState<PostPreview[]>([]);
    const [matchingHashtags, setMatchingHashtags] = useState<string[]>([]);

    const trimmedQuery = postResults.trim();

    useEffect(() => {
        let ignore = false;

        if (!trimmedQuery) {
            setMatchingPosts([]);
            setMatchingHashtags([]);
            return;
        }

        Promise.all([
            searchPostsByDescriptionPreview(trimmedQuery, MAX_RESULTS),
            searchHashtags(trimmedQuery, MAX_RESULTS),
        ])
            .then(([posts, hashtags]) => {
                if (ignore) return;
                setMatchingPosts(posts);
                setMatchingHashtags(hashtags);
            })
            .catch(() => {});

        return () => {
            ignore = true;
        };
    }, [trimmedQuery]);

    if (!trimmedQuery) return null;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Posts
                </div>
                {matchingPosts.length === 0 ? (
                    <p className="text-xs text-gray-400">No posts found</p>
                ) : (
                    matchingPosts.map((post) => (
                        <button
                            key={post.id}
                            type="button"
                            className="w-full flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20"
                            onClick={() =>
                                navigate(
                                    `/Search/results?q=${encodeURIComponent(post.description)}&tab=images`,
                                )
                            }
                        >
                            <img
                                src={post.imageURL}
                                alt=""
                                className="size-10 rounded object-cover shrink-0"
                            />
                            <span className="text-sm text-left">
                                <HighlightFirstMatch
                                    text={extractSearchSnippet(
                                        post.description,
                                        trimmedQuery,
                                    )}
                                    query={trimmedQuery}
                                />
                            </span>
                        </button>
                    ))
                )}
            </div>

            <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Hashtags
                </div>
                {matchingHashtags.length === 0 ? (
                    <p className="text-xs text-gray-400">No hashtags found</p>
                ) : (
                    matchingHashtags.map((hashtag) => (
                        <Link
                            key={hashtag}
                            to={`/Search/results?q=${encodeURIComponent(hashtag)}&tab=hashtags`}
                            className="flex items-center gap-3 border rounded p-2 bg-white dark:bg-dark hover:bg-gray-50 dark:hover:bg-black/20"
                        >
                            <span className="flex items-center justify-center size-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 font-bold text-sm">
                                #
                            </span>
                            <span className="text-sm">
                                <HighlightFirstMatch
                                    text={hashtag}
                                    query={trimmedQuery}
                                />
                            </span>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
