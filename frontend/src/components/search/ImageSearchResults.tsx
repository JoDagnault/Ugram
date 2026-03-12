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
        <button
            type="button"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent px-3 py-1 text-sm font-medium text-accent hover:bg-accent hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-dark"
            title="Search images by description"
            onClick={() =>
                navigate(`/Search/images?q=${encodeURIComponent(trimmedQuery)}`)
            }
        >
            <span className="text-xs uppercase tracking-wide">
                Search images for
            </span>
            <span className="text-sm font-semibold">
                &quot;{trimmedQuery}&quot;
            </span>
            <span aria-hidden="true" className="text-base">
                🔍
            </span>
        </button>
    );
}
