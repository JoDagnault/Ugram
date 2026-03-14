import { useEffect, useMemo, useState } from 'react';
import type { ImageDetails, ImageDetailsFields } from '../../../types/image.ts';
import {
    createMyImage,
    deleteMyImage,
    getImage,
    updateMyImage,
} from '../../../api/images/imagesService.ts';
import { getMe, getUsers } from '../../../api/users/usersService.ts';
import type { UserListItem } from '../../../types/user.ts';
import EditImageForm, {
    type ImageFormSubmission,
} from '../EditImageForm/EditImageForm.tsx';
import ImageActionsMenu from './ImageActionsMenu.tsx';
import ImageModalFrame from './ImageModalFrame.tsx';
import ImageMetadataSummary from './ImageMetadataSummary.tsx';
import * as Sentry from '@sentry/react';

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
    const { onClose } = props;
    const isCreateModal = props.mode === 'create';
    const imageId = isCreateModal ? undefined : props.imageId;

    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [image, setImage] = useState<ImageDetails | null>(null);
    const [loading, setLoading] = useState(!isCreateModal);
    const [users, setUsers] = useState<UserListItem[]>([]);
    const [currentUsername, setCurrentUsername] = useState('');

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousBodyOverflow;
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        Promise.all([
            getUsers().catch(() => [] as UserListItem[]),
            getMe().catch(() => undefined),
        ]).then(([fetchedUsers, me]) => {
            if (ignore) return;
            setUsers(fetchedUsers);
            setCurrentUsername(me?.username ?? '');
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
        Sentry.logger.info(`post ${imageId} deleted`);
        onClose();
    };

    const handleSave = async (nextFields: ImageFormSubmission) => {
        if (isCreateModal || !imageId) return;
        if (!image?.isOwner) return;

        const updated = await updateMyImage(imageId, nextFields);
        if (!updated) return;

        setImage(updated);
        if ('onUpdated' in props) props.onUpdated?.(updated);
        Sentry.logger.info(`post ${updated.id} updated`);
        setMode('view');
    };

    const handleCreate = async ({
        file,
        ...nextFields
    }: ImageFormSubmission) => {
        if (!file) return;

        const created = await createMyImage({ ...nextFields, file });

        if ('onCreated' in props) props.onCreated?.(created);
        Sentry.logger.info(`post ${created.id} created`);
        onClose();
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

                        <div>
                            {mode === 'edit' && !!image?.isOwner ? (
                                <EditImageForm
                                    users={users}
                                    currentUsername={currentUsername}
                                    initial={toImageDetailsFields(image)}
                                    onCancel={() => setMode('view')}
                                    onSubmit={handleSave}
                                />
                            ) : (
                                <div className="space-y-3 flex flex-col justify-end h-full p-2 min-[1242px]:block  min-[1242px]:p-0">
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
                        </div>
                    </div>
                )
            )}
        </ImageModalFrame>
    );
}
