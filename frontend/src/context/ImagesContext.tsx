import {
    createContext,
    useContext,
    useState,
    type ReactNode,
    type Dispatch,
    type SetStateAction,
} from 'react';

import type { ImageDetails } from '../types/image';

import {
    likeImage as apiLikeImage,
    unlikeImage as apiUnlikeImage,
    deleteMyImage,
    updateMyImage,
    commentImage,
    uncommentImage,
} from '../api/images/imagesService';
import { useLogger } from '../logger/logger.context.tsx';

type ImagesContextType = {
    images: ImageDetails[];
    setImages: Dispatch<SetStateAction<ImageDetails[]>>;

    toggleLike: (
        id: string,
        liked: boolean,
        currentUserId?: string,
    ) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    updateImage: (id: string, data: any) => Promise<void>;
    addComment: (id: string, comment: string) => Promise<void>;
    removeComment: (imageId: string, commentId: string) => Promise<void>;
};

const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

export function ImagesProvider({ children }: { children: ReactNode }) {
    const [images, setImages] = useState<ImageDetails[]>([]);
    const logger = useLogger();

    const toggleLike = async (
        id: string,
        liked: boolean,
        currentUserId?: string,
    ) => {
        setImages((prev) =>
            prev.map((img) => {
                if (img.id !== id) return img;

                const updatedLikes = liked
                    ? [
                          ...img.likes,
                          {
                              from: currentUserId || 'me',
                              createdAt: new Date().toISOString(),
                          },
                      ]
                    : currentUserId
                      ? img.likes.filter((l) => l.from !== currentUserId)
                      : img.likes.slice(0, img.likes.length - 1);

                return {
                    ...img,
                    isLiked: liked,
                    likes: updatedLikes,
                };
            }),
        );

        try {
            if (liked) {
                await apiLikeImage(id);
                logger.info('Liked image', { imageId: id });
            } else {
                await apiUnlikeImage(id);
                logger.info('Unliked image', { imageId: id });
            }
        } catch (e) {
            setImages((prev) =>
                prev.map((img) => {
                    if (img.id !== id) return img;

                    const revertedLikes = liked
                        ? currentUserId
                            ? img.likes.filter((l) => l.from !== currentUserId)
                            : img.likes.slice(0, img.likes.length - 1)
                        : [
                              ...img.likes,
                              {
                                  from: currentUserId || 'me',
                                  createdAt: new Date().toISOString(),
                              },
                          ];

                    return {
                        ...img,
                        isLiked: !liked,
                        likes: revertedLikes,
                    };
                }),
            );
        }
    };

    const deleteImage = async (id: string) => {
        const prevImages = images;
        setImages((prev) => prev.filter((img) => img.id !== id));

        try {
            const ok = await deleteMyImage(id);
            logger.info('Deleted image', { imageId: id });
            if (!ok) throw new Error();
        } catch {
            setImages(prevImages);
        }
    };

    const updateImage = async (id: string, data: any) => {
        try {
            const updated = await updateMyImage(id, data);
            if (!updated) return;

            setImages((prev) =>
                prev.map((img) => (img.id === id ? updated : img)),
            );
            logger.info('Updated image', { imageId: id });
        } catch {}
    };

    const addComment = async (id: string, comment: string) => {
        try {
            const updated = await commentImage(id, comment);
            if (!updated) return;

            setImages((prev) =>
                prev.map((img) => (img.id === id ? updated : img)),
            );
            logger.info('Adding comment', { imageId: id });
        } catch {}
    };

    const removeComment = async (imageId: string, commentId: string) => {
        setImages((prev) =>
            prev.map((img) =>
                img.id === imageId
                    ? {
                          ...img,
                          comments: img.comments.filter(
                              (c) => c.id !== commentId,
                          ),
                      }
                    : img,
            ),
        );

        try {
            await uncommentImage(imageId, commentId);
            logger.info('Removed comment', { imageId, commentId });
        } catch {}
    };
    return (
        <ImagesContext.Provider
            value={{
                images,
                setImages,
                toggleLike,
                deleteImage,
                updateImage,
                addComment,
                removeComment,
            }}
        >
            {children}
        </ImagesContext.Provider>
    );
}

export function useImages() {
    const context = useContext(ImagesContext);
    if (!context) {
        throw new Error('useImages must be used within ImagesProvider');
    }
    return context;
}
