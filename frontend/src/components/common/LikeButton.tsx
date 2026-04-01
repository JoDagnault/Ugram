import { useState, type MouseEvent } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { likeImage, unlikeImage } from '../../api/images/imagesService.ts';
import { useLogger } from '../../logger/logger.context.tsx';
import type { Logger } from '../../logger/logger.interface.ts';

interface LikeButtonProps {
    imageId: string;
    initialCount: number;
    initialLiked?: boolean;
    showCount?: boolean;
    onToggle?: (liked: boolean) => void;
    className?: string;
}

export default function LikeButton({
    imageId,
    initialCount,
    initialLiked = false,
    showCount = true,
    onToggle,
    className,
}: LikeButtonProps) {
    const logger: Logger = useLogger();
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);

    const toggle = async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        const nextLiked = !liked;
        setCount((c) => (liked ? c - 1 : c + 1));
        setLiked((l) => !l);
        onToggle?.(nextLiked);
        try {
            if (liked) {
                await unlikeImage(imageId);
                logger.info(`Liked ${imageId}`);
            } else {
                await likeImage(imageId);
                logger.info(`Unliked ${imageId}`);
            }
        } catch {
            setCount((c) => (liked ? c + 1 : c - 1));
            setLiked((l) => !l);
            onToggle?.(!nextLiked);
        }
    };

    return (
        <button
            onClick={toggle}
            className={`flex items-center gap-1.5 group ${className ?? ''}`}
        >
            {liked ? (
                <HeartSolid className="size-6 text-red-500" />
            ) : (
                <HeartOutline className="size-6 text-gray-400 group-hover:text-red-400" />
            )}
            {showCount && (
                <span
                    className={
                        liked ? 'text-red-500 text-sm' : 'text-gray-400 text-sm'
                    }
                >
                    {count}
                </span>
            )}
        </button>
    );
}
