import { apiFetch, apiUrl } from '../http.ts';

export type NotificationDto = {
    id: string;
    fromUserId: string;
    fromUsername: string;
    postId: string;
    type: string;
    createdAt: string;
};

export const getMyNotifications = async (): Promise<NotificationDto[]> => {
    const response = await apiFetch('/users/me/notifications');
    if (!response.ok) return [];
    return (await response.json()) as NotificationDto[];
};

export const deleteNotification = async (id: string): Promise<void> => {
    await apiFetch(`/users/me/notifications/${id}`, { method: 'DELETE' });
};

export const subscribeToNotifications = (
    onNotification: (notification: NotificationDto) => void,
): (() => void) => {
    const token = localStorage.getItem('jwt') ?? '';
    const source = new EventSource(
        apiUrl(
            `/users/me/notifications/stream?token=${encodeURIComponent(token)}`,
        ),
    );

    source.onmessage = (event) => {
        onNotification(JSON.parse(event.data) as NotificationDto);
    };

    return () => source.close();
};
