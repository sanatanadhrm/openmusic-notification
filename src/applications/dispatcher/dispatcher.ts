import { NotificationSender } from "@/domains/notification/notification-sender";
import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";

export interface Dispatcher {
    registerSender(sender: NotificationSender): void

    dispatch(payload: NotificationDetail): Promise<void>
}