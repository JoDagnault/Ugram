type Props = {
    label: string;
    removeLabel: string;
    onRemove: () => void;
};

export default function RemovableChip({ label, removeLabel, onRemove }: Props) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full border border-transparent bg-gray-200 dark:bg-black/30 px-2 py-1 text-xs">
            {label}
            <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full font-bold text-gray-600 dark:text-gray-300 transition-colors hover:bg-red-500 hover:text-white dark:hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                aria-label={removeLabel}
            >
                x
            </button>
        </span>
    );
}
