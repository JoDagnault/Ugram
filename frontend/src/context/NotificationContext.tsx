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
} from '../api/notifications/notificationsService.ts';

type NotificationContextValue = {
    hasUnread: boolean;
    markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue>({
    hasUnread: false,
    markAllRead: () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        getMyNotifications()
            .then((notifications) => {
                if (notifications.length > 0) setHasUnread(true);
            })
            .catch(() => {});

        const unsubscribe = subscribeToNotifications(() => {
            setHasUnread(true);
        });
        return unsubscribe;
    }, []);

    const markAllRead = () => setHasUnread(false);

    return (
        <NotificationContext.Provider value={{ hasUnread, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => useContext(NotificationContext);
