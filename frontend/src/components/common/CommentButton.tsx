import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface CommentButtonProps {
    count: number;
    onClick?: (e: React.MouseEvent) => void;
}

export default function CommentButton({ count, onClick }: CommentButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
        >
            <ChatBubbleLeftIcon className="size-6 text-gray-400 hover:text-white" />
            <span className="text-sm text-gray-400">{count}</span>
        </button>
    );
}
