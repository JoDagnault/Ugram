import { useNavigate } from 'react-router';

type Props = {
    query: string;
};

export default function ImageSearchResults({ query }: Props) {
    const navigate = useNavigate();
    const trimmedQuery = query.trim();

    if (trimmedQuery.length === 0) {
        return null;
    }

    return (
        <div
            className="mb-4 cursor-pointer hover:text-accent transition-colors"
            title="Search images by description"
            role="button"
            tabIndex={0}
            onClick={() =>
                navigate(`/Search/images?q=${encodeURIComponent(trimmedQuery)}`)
            }
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    navigate(
                        `/Search/images?q=${encodeURIComponent(trimmedQuery)}`,
                    );
                }
            }}
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
