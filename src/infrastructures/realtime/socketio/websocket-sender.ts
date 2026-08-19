import { Server } from "socket.io";
import { NotificationSender } from "@/domains/notification/notification-sender";
import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";
import { LoggerService } from "@/applications/logger/logger-service";

export class WebSocketNotificationSender implements NotificationSender {
    readonly channelName = "WEBSOCKET" as const;

    constructor(
        private _io: Server,
        private _logger: LoggerService
    ) { }

    async send(notification: NotificationDetail): Promise<void> {
        // 1. Broadcast ke room role jika ada targetRole (misal: "admin", "super_admin")
        if (notification.targetRole) {
            this._io.to(`role:${notification.targetRole}`).emit("notification:new", notification);
            this._logger.info(`WebSocketNotificationSender: Notifikasi dipancarkan ke room [role:${notification.targetRole}]`);
        }

        // 2. Kirim ke user spesifik jika ada userId
        if (notification.userId) {
            this._io.to(`user:${notification.userId}`).emit("notification:new", notification);
            this._logger.info(`WebSocketNotificationSender: Notifikasi dipancarkan ke room [user:${notification.userId}]`);
        }
    }
}
