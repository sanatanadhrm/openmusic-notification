export interface NotificationDetail {
    id: string;
    userId: string | null;
    targetRole: string | null;
    title: string;
    message: string;
    type: string;
    channels: string[];
    data: any;
    isRead: boolean;
    readAt: Date | null;
    createdAt: Date;
}