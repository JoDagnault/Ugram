import { useEffect, useState } from 'react';
import {
    deleteNotification,
    getMyNotifications,
    subscribeToNotifications,
    type NotificationDto,
} from '../api/notifications/notificationsService.ts';
import { useNotifications } from '../context/NotificationContext.tsx';

const notificationMessage = (n: NotificationDto): string => {
    const name = n.fromUsername || 'Someone';
    if (n.type === 'like') return `${name} liked your post.`;
    if (n.type === 'comment') return `${name} commented on your post.`;
    return `${name} mentioned you in a post.`;
};

export default function Notifications() {
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);
    const { markAllRead } = useNotifications();

    useEffect(() => {
        getMyNotifications()
            .then(setNotifications)
            .catch(() => {});
        markAllRead();

        const unsubscribe = subscribeToNotifications((notification) => {
            setNotifications((prev) => [notification, ...prev]);
        });

        return unsubscribe;
    }, []);

    const handleDelete = (id: string) => {
        deleteNotification(id).catch(() => {});
        setNotifications((prev) => prev.filter((n) => n.id !== id));
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
                        <div>
                            <p className="text-sm">{notificationMessage(n)}</p>
                            <p className="text-xs text-gray-500">
                                {new Date(n.createdAt).toLocaleString()}
                            </p>
                        </div>
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
