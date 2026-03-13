import type { ReactNode } from 'react';

type Props = {
    title: string;
    onClose: () => void;
    children: ReactNode;
    actions?: ReactNode;
    panelClassName?: string;
};

export default function ImageModalFrame({
    title,
    onClose,
    children,
    actions,
    panelClassName = 'w-[95%] max-w-[900px] h-[80vh] max-h-[1200px] overflow-hidden',
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div
                className={`bg-white dark:bg-dark rounded-lg flex flex-col ${panelClassName}`}
            >
                <div className="flex items-center justify-between p-3 border-b shrink-0">
                    <div className="font-semibold truncate">{title}</div>
                    <div className="flex items-center gap-2">
                        {actions}
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-9 h-9 rounded hover:bg-gray-100 dark:hover:bg-black/20"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-auto">{children}</div>
            </div>
        </div>
    );
}
