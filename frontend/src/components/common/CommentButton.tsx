import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface CommentButtonProps {
    count: number;
}

export default function CommentButton({ count }: CommentButtonProps) {
    return (
        <div className="flex items-center gap-1.5">
            <ChatBubbleLeftIcon className="size-6 text-gray-400 hover:text-white" />
            <span className="text-sm text-gray-400">{count}</span>
        </div>
    );
}
