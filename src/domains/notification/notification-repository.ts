import { CreateNotificationPayload } from "./entities/payload/create-notification";
import { NotificationDetail } from "./entities/response/notification-detail";

export interface NotificationRepository {
    create(payload: CreateNotificationPayload): Promise<NotificationDetail>;
    getByUserOrRole(userId: string, role: string): Promise<NotificationDetail[]>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(userId: string, role: string): Promise<void>;
    countUnread(userId: string, role: string): Promise<number>;
}
