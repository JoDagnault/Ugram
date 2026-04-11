import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    deleteNotification,
    type NotificationDto,
} from '../api/notifications/notificationsService.ts';
import { getImage } from '../api/images/imagesService.ts';
import { useNotifications } from '../context/NotificationContext.tsx';

const notificationMessage = (n: NotificationDto): string => {
    const name = n.fromUsername || 'Someone';
    if (n.type === 'like') return `${name} liked your post.`;
    if (n.type === 'comment') return `${name} commented on your post.`;
    return `${name} mentioned you in a post.`;
};

export default function Notifications() {
    const [postImages, setPostImages] = useState<Record<string, string>>({});
    const { markAllRead, notifications, removeNotification } =
        useNotifications();
    const navigate = useNavigate();

    useEffect(() => {
        markAllRead();
    }, []);

    useEffect(() => {
        const uniquePostIds = [...new Set(notifications.map((n) => n.postId))];
        Promise.all(
            uniquePostIds.map((id) =>
                getImage(id).then((img) =>
                    img ? { id, url: img.imageUrl } : null,
                ),
            ),
        ).then((results) => {
            const map: Record<string, string> = {};
            for (const r of results) {
                if (r) map[r.id] = r.url;
            }
            setPostImages(map);
        });
    }, [notifications]);

    const handleDelete = (id: string) => {
        deleteNotification(id).catch(() => {});
        removeNotification(id);
    };

    return (
        <div className="max-w-xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-semibold">Notifications</h1>
            {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications.</p>
            ) : (
                notifications.map((n) => (
                    <div
                        key={n.id}
                        className="border rounded p-3 bg-white dark:bg-dark flex items-start justify-between gap-2"
                    >
                        <button
                            type="button"
                            className="text-left flex-1 flex items-center gap-3"
                            onClick={() => navigate(`/?post=${n.postId}`)}
                        >
                            {postImages[n.postId] && (
                                <img
                                    src={postImages[n.postId]}
                                    alt=""
                                    className="size-12 rounded object-cover flex-shrink-0"
                                />
                            )}
                            <div>
                                <p className="text-sm">
                                    {notificationMessage(n)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleDelete(n.id)}
                            className="text-gray-400 hover:text-red-500 text-lg leading-none"
                            title="Delete"
                        >
                            ×
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
