type Props = {
    query: string;
};

export default function ImageSearchResults({ query }: Props) {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
        return null;
    }

    return (
        <div
            className="mb-4 cursor-pointer hover:text-accent transition-colors"
            title="Clickable later (open image search page)"
        >
            <span className="text-sm text-gray-600 dark:text-gray-400">
                Search images for:{' '}
            </span>
            <span className="text-sm font-semibold">
                &quot;{trimmedQuery}&quot;
            </span>
        </div>
    );
}
