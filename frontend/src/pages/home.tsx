import { useEffect, useState } from 'react';
import { getFeedImages } from '../api/images/imagesService';
import type { ImageDetails } from '../types/image';
import ImageCard from '../components/image/ImageCard.tsx';
import ImageModal from '../components/image/ImageModal/ImageModal.tsx';
import { useLogger } from '../logger/logger.context.tsx';
import type { Logger } from '../logger/logger.interface.ts';
import { PopularHashtags } from '../components/hashtags/PopularHashtags';

const Home = () => {
    const logger: Logger = useLogger();
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(
        null,
    );
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
    const [exactMatch, setExactMatch] = useState<boolean>(false);

    const [trendingRefreshKey, setTrendingRefreshKey] = useState(0);

    useEffect(() => {
        if (!selectedHashtag) {
            getFeedImages()
                .then(setImages)
                .finally(() => {
                    logger.info('User is on Feed page');
                    setIsLoading(false);
                });
        }

        const timer = setTimeout(() => setShowLoading(true), 300);
        return () => clearTimeout(timer);
    }, [selectedHashtag]);

    const refreshFeed = async () => {
        const feedImages = await getFeedImages(
            selectedHashtag ?? undefined,
            exactMatch,
        );
        setImages(feedImages);
    };

    const handleHashtagClick = async (tag: string, exactMatch: boolean) => {
        setSelectedHashtag(tag);
        setExactMatch(exactMatch);

        const feedImages = await getFeedImages(tag, exactMatch);
        setImages(feedImages);
    };

    const triggerTrendingRefresh = () => {
        setTrendingRefreshKey((k) => k + 1);
    };

    if (showLoading && isLoading) {
        return <p className="p-4">Loading feed…</p>;
    }

    if (showLoading && images.length === 0) {
        return <p className="p-4">No images to display.</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 max-w-6xl mx-auto">
            <aside className="order-first lg:order-last">
                <PopularHashtags
                    onHashtagClick={handleHashtagClick}
                    refreshKey={trendingRefreshKey}
                />
            </aside>

            <div className="lg:col-span-2 space-y-6 order-last lg:order-first">
                {selectedHashtag && (
                    <div className="flex justify-center mb-4">
                        <div className="flex items-center gap-2 bg-dark-secondary border border-dark-gray px-3 py-1 rounded-full">
                            <span className="text-white text-sm">
                                <span className="text-accent font-bold">
                                    #{selectedHashtag}
                                </span>
                            </span>

                            <button
                                onClick={() => {
                                    setSelectedHashtag(null);
                                    setExactMatch(false);
                                }}
                                className="text-dark-gray hover:text-white hover:bg-dark-gray/40 transition rounded-full px-2 py-0.5 cursor-pointer"
                                title="Remove filter"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

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

            {selectedImage && (
                <ImageModal
                    imageId={selectedImage.id}
                    onClose={() => {
                        setSelectedImage(null);
                        triggerTrendingRefresh();
                    }}
                    onDeleted={() => {
                        setSelectedImage(null);
                        refreshFeed();
                        triggerTrendingRefresh();
                    }}
                    onUpdated={() => {
                        refreshFeed();
                        triggerTrendingRefresh();
                    }}
                />
            )}
        </div>
    );
};

export default Home;
