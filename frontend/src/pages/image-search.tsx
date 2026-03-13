import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';

import type { ImageDetails } from '../types/image';
import ImageCard from '../components/image/ImageCard';
import ImageModal from '../components/image/ImageModal/ImageModal';
import { useImageSearchByDescription } from '../api/images/useImageSearch';

export default function ImageSearchPage() {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(
        null,
    );

    const query = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return params.get('q')?.trim() ?? '';
    }, [location.search]);

    const { status, images, hasQuery } = useImageSearchByDescription(query);

    if (!query) {
        return (
            <div className="p-4 max-w-3xl mx-auto">
                <p className="text-sm text-gray-500">
                    No search term provided. Go back to the search page and try
                    again.
                </p>
            </div>
        );
    }

    if (status === 'loading') {
        return <p className="p-4">Loading images…</p>;
    }

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
            <header className="border-b pb-3 mb-4">
                <h1 className="text-lg font-semibold">
                    Image results for &quot;{query}&quot;
                </h1>
                <p className="text-sm text-gray-500">
                    Showing images whose description contains your search term.
                </p>
            </header>

            {hasQuery && images.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No images found with a description matching &quot;{query}
                    &quot;.
                </p>
            ) : (
                <div className="space-y-6">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelectedImage(image)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setSelectedImage(image);
                                }
                            }}
                            className="cursor-pointer"
                            title="Open image"
                        >
                            <ImageCard image={image} />
                        </div>
                    ))}
                </div>
            )}

            {selectedImage && (
                <ImageModal
                    imageId={selectedImage.id}
                    onClose={() => setSelectedImage(null)}
                    onDeleted={() => {
                        setSelectedImage(null);
                    }}
                />
            )}
        </div>
    );
}
