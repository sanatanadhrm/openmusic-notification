import { NotificationSender } from "../../domains/notification/notification-sender";
import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";
import { LoggerService } from "../../applications/logger/logger-service";
import { Dispatcher } from "@/applications/dispatcher/dispatcher";

export class NotificationDispatcher implements Dispatcher {
    private _senders: Map<string, NotificationSender> = new Map();
    private _logger?: LoggerService;

    constructor(logger?: LoggerService) {
        this._logger = logger;
    }

    registerSender(sender: NotificationSender): void {
        this._senders.set(sender.channelName, sender);
        this._logger?.info(`[NotificationDispatcher] Sender terdaftar untuk channel: ${sender.channelName}`);
    }

    async dispatch(notification: NotificationDetail): Promise<void> {
        const targetChannels = (notification.channels && notification.channels.length > 0)
            ? notification.channels
            : ["WEBSOCKET"];

        for (const channel of targetChannels) {
            const sender = this._senders.get(channel);
            if (sender) {
                try {
                    await sender.send(notification);
                } catch (error) {
                    this._logger?.error(`[NotificationDispatcher] Gagal kirim ke channel ${channel}:`, error);
                }
            } else {
                this._logger?.warn(`[NotificationDispatcher] Tidak ditemukan sender untuk channel ${channel}`);
            }
        }
    }
}
