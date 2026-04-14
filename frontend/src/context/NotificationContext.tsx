import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';
import {
    getMyNotifications,
    subscribeToNotifications,
    type NotificationDto,
} from '../api/notifications/notificationsService.ts';

type NotificationContextValue = {
    hasUnread: boolean;
    markAllRead: () => void;
    notifications: NotificationDto[];
    removeNotification: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextValue>({
    hasUnread: false,
    markAllRead: () => {},
    notifications: [],
    removeNotification: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [hasUnread, setHasUnread] = useState(false);
    const [notifications, setNotifications] = useState<NotificationDto[]>([]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        const connect = () => {
            const token = localStorage.getItem('jwt');
            if (!token) return;

            getMyNotifications()
                .then((notifs) => {
                    setNotifications(notifs);
                    if (notifs.length > 0) setHasUnread(true);
                    console.info('[NotificationContext] Notifications loaded', {
                        count: notifs.length,
                    });
                })
                .catch(() => {});

            unsubscribe?.();
            unsubscribe = subscribeToNotifications(() => {
                getMyNotifications()
                    .then((notifs) => {
                        setNotifications(notifs);
                        console.info(
                            '[NotificationContext] New notification received',
                        );
                    })
                    .catch(() => {});
                setHasUnread(true);
            });
        };

        const disconnect = () => {
            unsubscribe?.();
            unsubscribe = undefined;
            setNotifications([]);
            setHasUnread(false);
        };

        connect();
        window.addEventListener('auth-login', connect);
        window.addEventListener('auth-logout', disconnect);

        return () => {
            window.removeEventListener('auth-login', connect);
            window.removeEventListener('auth-logout', disconnect);
            unsubscribe?.();
        };
    }, []);

    const markAllRead = () => setHasUnread(false);
    const removeNotification = (id: string) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id));

    return (
        <NotificationContext.Provider
            value={{
                hasUnread,
                markAllRead,
                notifications,
                removeNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
