import { useEffect, useMemo, useState } from 'react';
import type { ImageDetails, ImageDetailsFields } from '../../../types/image.ts';
import {
    createMyImage,
    getImage,
    updateMyImage,
} from '../../../api/images/imagesService.ts';
import { getMe } from '../../../api/users/usersService.ts';
import type { UserListItem } from '../../../types/user.ts';
import EditImageForm, {
    type ImageFormSubmission,
} from '../EditImageForm/EditImageForm.tsx';
import ImageActionsMenu from './ImageActionsMenu.tsx';
import ImageModalFrame from './ImageModalFrame.tsx';
import ImageMetadataSummary from './ImageMetadataSummary.tsx';
import CommentSection from './CommentSection.tsx';
import CommentInput from './CommentInput.tsx';
import CommentsBottomSheet from './CommentsBottomSheet.tsx';
import LikeButton from '../../common/LikeButton.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';
import LikesModal from './LikesModal.tsx';
import { useLogger } from '../../../logger/logger.context.tsx';
import type { Logger } from '../../../logger/logger.interface.ts';
import { useUsers } from '../../../hooks/useUsers.ts';
import { useImages } from '../../../context/ImagesContext.tsx';

type ExistingImageModalProps = {
    mode?: 'view';
    imageId: string;
    onClose: () => void;
    onDeleted?: (imageId: string) => void;
    onUpdated?: (next: ImageDetails) => void;
};

type CreateImageModalProps = {
    mode: 'create';
    onClose: () => void;
    onCreated?: (created: ImageDetails) => void;
};

type Props = ExistingImageModalProps | CreateImageModalProps;

const EMPTY_IMAGE_DETAILS_FIELDS: ImageDetailsFields = {
    description: '',
    hashtags: [],
    mentions: [],
};
const toImageDetailsFields = (image: ImageDetails): ImageDetailsFields => ({
    description: image.description,
    hashtags: image.hashtags,
    mentions: image.mentions,
});

const dateFormat = (iso: string): string => new Date(iso).toLocaleDateString();

export default function ImageModal(props: Props) {
    const logger: Logger = useLogger();
    const { onClose } = props;
    const { me } = useAuth();
    const { images, toggleLike, deleteImage, setImages, removeComment } =
        useImages();
    const isCreateModal = props.mode === 'create';
    const imageId = isCreateModal ? undefined : props.imageId;

    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [image, setImage] = useState<ImageDetails | null>(null);
    const [loading, setLoading] = useState(!isCreateModal);
    const users: UserListItem[] = useUsers();
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        Promise.all([getMe().catch(() => undefined)]).then(([me]) => {
            if (ignore) return;
            setCurrentUsername(me?.username ?? '');
            setCurrentUserId(me?.id ?? '');
        });

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (isCreateModal || !imageId) {
            setImage(null);
            setLoading(false);
            return;
        }

        let ignore = false;
        setLoading(true);

        getImage(imageId)
            .then((loadedImage) => {
                if (!ignore) {
                    setImage(loadedImage ?? null);
                    if (loadedImage) {
                        setImages((prev) =>
                            prev.map((img) =>
                                img.id === loadedImage.id ? loadedImage : img,
                            ),
                        );
                    }
                }
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [imageId, isCreateModal, setImages]);

    useEffect(() => {
        setMode('view');
    }, [imageId, isCreateModal]);

    useEffect(() => {
        if (!imageId) return;
        const fresh = images.find((img) => img.id === imageId);
        if (fresh) setImage(fresh);
    }, [images, imageId]);

    const userIdToUsername = useMemo(
        () => new Map(users.map((user) => [user.id, user.username])),
        [users],
    );

    const handleDelete = async () => {
        if (isCreateModal || !imageId) return;
        if (!image?.isOwner) return;

        await deleteImage(imageId);
        if ('onDeleted' in props) props.onDeleted?.(imageId);
        logger.info(`post ${imageId} deleted`);
        onClose();
    };

    const handleSave = async (nextFields: ImageFormSubmission) => {
        if (isCreateModal || !imageId) return;
        if (!image?.isOwner) return;

        const updated = await updateMyImage(imageId, nextFields);
        if (!updated) return;

        setImage(updated);
        setImages((prev) =>
            prev.map((img) => (img.id === updated.id ? updated : img)),
        );
        if ('onUpdated' in props) props.onUpdated?.(updated);
        logger.info(`post ${updated.id} updated`);
        setMode('view');
    };

    const handleCreate = async ({
        file,
        ...nextFields
    }: ImageFormSubmission) => {
        if (!file) return;

        const created = await createMyImage({ ...nextFields, file });

        setImages((prev) => [created, ...prev]);
        if ('onCreated' in props) props.onCreated?.(created);
        logger.info(`post ${created.id} created`);
        onClose();
    };

    const handleCommentPosted = async (updated: ImageDetails) => {
        const freshImage = await getImage(updated.id);
        if (freshImage) {
            setImage(freshImage);
            setImages((prev) =>
                prev.map((img) =>
                    img.id === freshImage.id ? freshImage : img,
                ),
            );
        }
        if ('onUpdated' in props) props.onUpdated?.(updated);
    };

    const handleLikeToggled = async (liked: boolean) => {
        if (!image?.id) return;
        await toggleLike(image.id, liked, currentUserId);
    };

    const handleCommentDeleted = async (commentId: string) => {
        if (!imageId) return;
        await removeComment(imageId, commentId);
        logger.info(`comment ${commentId} deleted`);
        setImage((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                comments: prev.comments.filter((c) => c.id !== commentId),
            };
        });
    };

    const modalTitle = isCreateModal ? 'Create Post' : '';
    if (!isCreateModal && (loading || !image)) {
        const isNotFound = !loading && !image;
        return (
            <ImageModalFrame
                title={isNotFound ? 'Image not found' : 'Image'}
                onClose={onClose}
                panelClassName="w-[90%] max-w-xl"
            >
                <div className="p-4">
                    {isNotFound
                        ? 'The requested image does not exist.'
                        : 'Loading...'}
                </div>
            </ImageModalFrame>
        );
    }

    return (
        <ImageModalFrame
            title={modalTitle}
            onClose={onClose}
            panelClassName={
                isCreateModal
                    ? 'w-[95%] max-w-[900px] max-h-[90vh] overflow-hidden h-auto'
                    : undefined
            }
            actions={
                !isCreateModal && mode === 'view' ? (
                    <ImageActionsMenu
                        isOwner={!!image?.isOwner}
                        onEdit={() => setMode('edit')}
                        onDelete={handleDelete}
                        onReport={() => {}}
                    />
                ) : undefined
            }
        >
            {isCreateModal ? (
                <div className="p-3">
                    <EditImageForm
                        mode="create"
                        users={users}
                        currentUsername={currentUsername}
                        initial={EMPTY_IMAGE_DETAILS_FIELDS}
                        onCancel={onClose}
                        onSubmit={handleCreate}
                    />
                </div>
            ) : (
                image && (
                    <div className="p-2.5 min-[750px]:p-3 min-[1242px]:p-4 grid grid-cols-1 min-[1242px]:grid-cols-2 gap-3 min-[1242px]:divide-x divide-dark-gray min-[750px]:gap-4 h-full">
                        <div className="flex items-center justify-center min-h-0 overflow-hidden min-[1242px]:pr-4">
                            <img
                                src={image.imageUrl}
                                alt={image.id}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="flex flex-col h-full min-h-0">
                            {mode === 'edit' && !!image?.isOwner ? (
                                <EditImageForm
                                    users={users}
                                    currentUsername={currentUsername}
                                    initial={toImageDetailsFields(image)}
                                    onCancel={() => setMode('view')}
                                    onSubmit={handleSave}
                                />
                            ) : (
                                <div className="flex-shrink min-[1242px]:flex-shrink-0 space-y-3 flex flex-col justify-end p-2 min-[1242px]:block  min-[1242px]:p-0">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Posted on {dateFormat(image.createdAt)}
                                    </div>

                                    <ImageMetadataSummary
                                        hashtags={image.hashtags}
                                        mentions={image.mentions}
                                        publisher={
                                            userIdToUsername.get(
                                                image.userId,
                                            ) ?? 'Unknown'
                                        }
                                        description={image.description}
                                        userIdToUsername={userIdToUsername}
                                    />
                                </div>
                            )}
                            <CommentSection
                                comments={image.comments}
                                userIdToUsername={userIdToUsername}
                                onCommentDeleted={handleCommentDeleted}
                                className="hidden min-[1242px]:flex flex-1 min-h-0 overflow-hidden"
                            />

                            <div className="py-2 flex items-center gap-3">
                                {me && (
                                    <LikeButton
                                        imageId={image.id}
                                        className="w-12"
                                        count={image.likes.length}
                                        liked={image.isLiked}
                                        showCount={false}
                                        onToggle={handleLikeToggled}
                                    />
                                )}

                                <button
                                    onClick={() => setShowLikes(true)}
                                    className="text-sm text-gray-400 hover:underline -ml-4.5"
                                >
                                    {image.likes.length} likes
                                </button>

                                <button
                                    onClick={() => setShowComments(true)}
                                    className="min-[1242px]:hidden text-sm text-gray-400 hover:underline ml-auto"
                                >
                                    {image.comments.length} comments
                                </button>
                            </div>

                            {showLikes && (
                                <LikesModal
                                    likes={image.likes}
                                    userIdToUsername={userIdToUsername}
                                    onClose={() => setShowLikes(false)}
                                />
                            )}

                            <div className="hidden min-[1242px]:block">
                                <CommentInput
                                    imageId={image.id}
                                    onCommentPosted={handleCommentPosted}
                                />
                            </div>
                        </div>
                    </div>
                )
            )}

            {image && (
                <CommentsBottomSheet
                    isOpen={showComments}
                    onClose={() => setShowComments(false)}
                    image={image}
                    userIdToUsername={userIdToUsername}
                    onCommentDeleted={handleCommentDeleted}
                    onCommentPosted={handleCommentPosted}
                />
            )}
        </ImageModalFrame>
    );
}
