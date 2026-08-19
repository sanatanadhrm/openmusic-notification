import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";

export interface NotificationSender {
    readonly channelName: "WEBSOCKET" | "EMAIL" | "WHATSAPP";
    send(notification: NotificationDetail): Promise<void>;
}
