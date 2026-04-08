import { useEffect, useMemo, useState } from 'react';
import type { ImageDetails, ImageDetailsFields } from '../../../types/image.ts';
import {
    createMyImage,
    deleteMyImage,
    getImage,
    uncommentImage,
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
import LikeButton from '../../common/LikeButton.tsx';
import { useAuth } from '../../../context/AuthContext.tsx';
import LikesModal from './LikesModal.tsx';
import { useLogger } from '../../../logger/logger.context.tsx';
import type { Logger } from '../../../logger/logger.interface.ts';
import { useUsers } from '../../../hooks/useUsers.ts';

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
    const isCreateModal = props.mode === 'create';
    const imageId = isCreateModal ? undefined : props.imageId;

    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [image, setImage] = useState<ImageDetails | null>(null);
    const [loading, setLoading] = useState(!isCreateModal);
    const users: UserListItem[] = useUsers();
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentUserId, setCurrentUserId] = useState('');
    const [showLikes, setShowLikes] = useState(false);

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
                if (!ignore) setImage(loadedImage ?? null);
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [imageId, isCreateModal]);

    useEffect(() => {
        setMode('view');
    }, [imageId, isCreateModal]);

    const userIdToUsername = useMemo(
        () => new Map(users.map((user) => [user.id, user.username])),
        [users],
    );

    const handleDelete = async () => {
        if (isCreateModal || !imageId) return;
        if (!image?.isOwner) return;

        const ok = await deleteMyImage(imageId);
        if (!ok) return;

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

        if ('onCreated' in props) props.onCreated?.(created);
        logger.info(`post ${created.id} created`);
        onClose();
    };

    const handleCommentPosted = (updated: ImageDetails) => {
        setImage(updated);
        if ('onUpdated' in props) props.onUpdated?.(updated);
    };

    const handleLikeToggled = (liked: boolean) => {
        setImage((prev) => {
            if (!prev) return prev;
            const likes = liked
                ? [
                      ...prev.likes,
                      {
                          from: currentUserId,
                          createdAt: new Date().toISOString(),
                      },
                  ]
                : prev.likes.filter((l) => l.from !== currentUserId);
            return { ...prev, likes };
        });
    };

    const handleCommentDeleted = async (commentId: string) => {
        if (!imageId) return;
        await uncommentImage(imageId, commentId);
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
                                <div className="flex-shrink-0 space-y-3 flex flex-col justify-end p-2 min-[1242px]:block  min-[1242px]:p-0">
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
                                className="flex-1 min-h-0 overflow-hidden"
                            />

                            <div className="py-2 flex items-center">
                                {me && (
                                    <LikeButton
                                        imageId={image.id}
                                        className="w-12"
                                        initialCount={image.likes.length}
                                        initialLiked={image.isLiked}
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
                            </div>

                            {showLikes && (
                                <LikesModal
                                    likes={image.likes}
                                    userIdToUsername={userIdToUsername}
                                    onClose={() => setShowLikes(false)}
                                />
                            )}

                            <CommentInput
                                imageId={image.id}
                                onCommentPosted={handleCommentPosted}
                            />
                        </div>
                    </div>
                )
            )}
        </ImageModalFrame>
    );
}
