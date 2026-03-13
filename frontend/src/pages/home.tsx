import { useEffect, useState } from 'react';
import { getFeedImages } from '../api/images/imagesService';
import type { ImageDetails } from '../types/image';
import ImageCard from '../components/image/ImageCard.tsx';
import ImageModal from '../components/image/ImageModal/ImageModal.tsx';
import * as Sentry from '@sentry/react';

const Home = () => {
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(
        null,
    );

    const loadFeed = async () => {
        try {
            const feedImages = await getFeedImages();
            setImages(feedImages);
        } finally {
            Sentry.logger.info('User is on Feed page');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadFeed();
    }, []);

    const refreshFeed = async () => {
        const feedImages = await getFeedImages();
        setImages(feedImages);
    };

    if (isLoading) {
        return <p className="p-4">Loading feed…</p>;
    }

    if (images.length === 0) {
        return <p className="p-4">No images to display.</p>;
    }

    return (
        <div className="space-y-6 p-4 max-w-3xl mx-auto">
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

            {selectedImage && (
                <ImageModal
                    imageId={selectedImage.id}
                    onClose={() => setSelectedImage(null)}
                    onDeleted={() => {
                        setSelectedImage(null);
                        refreshFeed();
                    }}
                    onUpdated={refreshFeed}
                />
            )}
        </div>
    );
};

export default Home;
