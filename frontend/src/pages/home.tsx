import { useCallback, useEffect, useRef, useState } from 'react';
import { getFeedImages } from '../api/images/imagesService';
import type { ImageDetails } from '../types/image';
import ImageCard from '../components/image/ImageCard.tsx';
import ImageModal from '../components/image/ImageModal/ImageModal.tsx';
import { useLogger } from '../logger/logger.context.tsx';
import type { Logger } from '../logger/logger.interface.ts';
import { PopularHashtags } from '../components/hashtags/PopularHashtags';

export default function Home() {
    const logger = useRef<Logger>(useLogger());
    const [images, setImages] = useState<ImageDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showLoading, setShowLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(
        null,
    );
    const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
    const [exactMatch, setExactMatch] = useState<boolean>(false);
    const [trendingRefreshKey, setTrendingRefreshKey] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [ready, setReady] = useState(false);

    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const isLoadingMore = useRef(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const updateHasMore = (more: boolean) => {
        setHasMore(more);
        hasMoreRef.current = more;
    };

    const loadMoreRef = useCallback(async () => {
        if (isLoadingMore.current || !hasMoreRef.current) return;
        isLoadingMore.current = true;
        try {
            const nextPage = pageRef.current + 1;
            const { images: imgs, hasMore: more } = await getFeedImages(
                nextPage,
                selectedHashtag ?? undefined,
                exactMatch,
            );
            setImages((prev) => [...prev, ...imgs]);
            updateHasMore(more);
            pageRef.current = nextPage;
        } finally {
            isLoadingMore.current = false;
        }
    }, [selectedHashtag, exactMatch]);

    useEffect(() => {
        if (!selectedHashtag) {
            getFeedImages(1)
                .then(({ images: imgs, hasMore: more }) => {
                    setImages(imgs);
                    updateHasMore(more);
                    pageRef.current = 1;
                })
                .finally(() => {
                    logger.current.info('User is on Feed page');
                    setIsLoading(false);
                    setReady(true);
                });
        }
        const timer = setTimeout(() => setShowLoading(true), 300);
        return () => clearTimeout(timer);
    }, [selectedHashtag]);

    useEffect(() => {
        if (!ready || !loaderRef.current) return;
        const node = loaderRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) loadMoreRef();
            },
            { threshold: 0.1 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [ready, selectedHashtag, loadMoreRef]);

    const refreshFeed = async () => {
        const { images: imgs, hasMore: more } = await getFeedImages(
            1,
            selectedHashtag ?? undefined,
            exactMatch,
        );
        setImages(imgs);
        updateHasMore(more);
        pageRef.current = 1;
    };

    const handleHashtagClick = async (tag: string, exact: boolean) => {
        setSelectedHashtag(tag);
        setExactMatch(exact);
        const { images: imgs } = await getFeedImages(1, tag, exact);
        setImages(imgs);
    };

    const triggerTrendingRefresh = () => setTrendingRefreshKey((k) => k + 1);

    if (showLoading && isLoading) return <p className="p-4">Loading feed…</p>;
    if (showLoading && images.length === 0)
        return <p className="p-4">No images to display.</p>;

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
                            if (e.key === 'Enter' || e.key === ' ')
                                setSelectedImage(image);
                        }}
                        className="cursor-pointer"
                        title="Open image"
                    >
                        <ImageCard image={image} />
                    </div>
                ))}

                <div
                    ref={loaderRef}
                    className="py-4 text-center text-dark-gray text-sm"
                >
                    {hasMore ? 'Loading...' : 'No other post'}
                </div>
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
}
