import { useEffect, useState } from 'react';
import {
    getPopularHashtags,
    type PopularHashtag,
} from '../../api/hashtags/hashtagsService';
import { useLogger } from '../../logger/logger.context';
import type { Logger } from '../../logger/logger.interface';

type Props = {
    onHashtagClick: (hashtag: string, exactMatch: boolean) => void;
    refreshKey: number;
};

export function PopularHashtags({ onHashtagClick, refreshKey }: Props) {
    const logger: Logger = useLogger();
    const [hashtags, setHashtags] = useState<PopularHashtag[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHashtags = async () => {
        logger.info('[PopularHashtags] Fetching trending hashtags…');

        try {
            const data = await getPopularHashtags();
            setHashtags(data);
            logger.info('[PopularHashtags] Trending hashtags updated', {
                count: data.length,
            });
        } catch (err) {
            logger.error(
                '[PopularHashtags] Failed to fetch trending hashtags',
                err,
            );
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchHashtags();
    }, [refreshKey]);

    if (loading) {
        return <p className="text-sm text-dark-gray">Loading hashtags…</p>;
    }

    return (
        <div className="rounded-lg p-4 space-y-3 bg-dark-secondary border border-dark-gray">
            <h2 className="text-lg font-semibold text-white">Trending ⬆️</h2>

            <ul className="space-y-2">
                {hashtags.map((h) => (
                    <li
                        key={h.name}
                        className="flex justify-between text-sm cursor-pointer hover:bg-dark-gray/30 rounded px-2 py-1 transition"
                        onClick={() => onHashtagClick(h.name, true)}
                    >
                        <span className="font-medium text-accent">
                            #{h.name}
                        </span>
                        <span className="text-accent">{h.count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
