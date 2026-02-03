import type { ImageDetails } from '../types/image';
import ImageCard from './imageCard.tsx';

type Props = {
    images: ImageDetails[];
};

export default function ImageSearchResults({ images }: Props) {
    if (images.length === 0) {
        return (
            <p className="mt-2 text-center text-sm text-gray-500">
                No images found
            </p>
        );
    }

    return (
        <div className="mt-4 space-y-6">
            {images.map((img) => (
                <div
                    key={img.id}
                    className="border rounded-lg shadow-sm bg-white dark:bg-dark"
                >
                    {/* Image and core info */}
                    <ImageCard image={img} />

                    {/* Extra info block (ID + potential future actions) */}
                    <div className="px-3 pb-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                            ID: {img.id}
                        </div>

                        {/* INLINE metadata */}
                        <div className="flex flex-wrap gap-1">
                            <span className="opacity-70 italic">
                                Posted on{' '}
                                {new Date(img.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
