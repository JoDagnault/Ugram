import { type MouseEvent, useEffect, useState } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { useLogger } from '../../logger/logger.context.tsx';
import type { Logger } from '../../logger/logger.interface.ts';

interface LikeButtonProps {
    imageId: string;
    count: number;
    liked?: boolean;
    showCount?: boolean;
    onToggle?: (liked: boolean) => Promise<void>;
    className?: string;
}

export default function LikeButton({
    imageId,
    count,
    liked = false,
    showCount = true,
    onToggle,
    className,
}: LikeButtonProps) {
    const logger: Logger = useLogger();
    const [isLiked, setIsLiked] = useState(liked);
    const [optimisticCount, setOptimisticCount] = useState(count);

    const toggle = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const next = !isLiked;

        setIsLiked(next);
        setOptimisticCount((c) => c + (next ? 1 : -1));

        try {
            await onToggle?.(next);
            logger.info(`${next ? 'Liked' : 'Unliked'} ${imageId}`);
        } catch (error) {
            setIsLiked(!next);
            setOptimisticCount((c) => c + (next ? -1 : 1));
            logger.error('Failed to toggle like', { imageId });
        }
    };

    useEffect(() => {
        setIsLiked(liked);
        setOptimisticCount(count);
    }, [liked, count]);

    return (
        <button
            onClick={toggle}
            className={`flex items-center gap-1.5 group ${className ?? ''}`}
        >
            {isLiked ? (
                <HeartSolid className="size-6 text-red-500" />
            ) : (
                <HeartOutline className="size-6 text-gray-400 group-hover:text-red-400" />
            )}
            {showCount && (
                <span
                    className={
                        isLiked
                            ? 'text-red-500 text-sm'
                            : 'text-gray-400 text-sm'
                    }
                >
                    {optimisticCount}
                </span>
            )}
        </button>
    );
}
