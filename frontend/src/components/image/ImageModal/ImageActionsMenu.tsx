import { useEffect, useRef, useState } from 'react';

type Props = {
    isOwner: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onReport: () => void;
};

export default function ImageActionsMenu({
    isOwner,
    onEdit,
    onDelete,
    onReport,
}: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-black/20"
                aria-label="Open image actions"
                title="Actions"
            >
                …
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-40 border rounded bg-white dark:bg-dark shadow">
                    {isOwner ? (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    onEdit();
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-black/20"
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOpen(false);
                                    onDelete();
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-black/20 text-red-600"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onReport();
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-black/20"
                        >
                            Report
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
