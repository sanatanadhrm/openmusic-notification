import { SendNotificationUseCase } from "@/applications/usecase/notification/send-notification-usecase";
import { LoggerService } from "@/applications/logger/logger-service";

export class UserQueueHandler {
    constructor(
        private _sendNotificationUseCase: SendNotificationUseCase,
        private _logger: LoggerService
    ) {
        this.handleUserRegistered = this.handleUserRegistered.bind(this);
    }

    async handleUserRegistered(data: any): Promise<void> {
        this._logger.info(`[UserQueueHandler] Memproses notifikasi user baru: ${data.username}`);

        // 1. Notifikasi Admin
        await this._sendNotificationUseCase.execute({
            title: "Pengguna Baru Terdaftar",
            message: `Pengguna ${data.fullname} (@${data.username}) baru saja bergabung!`,
            type: "USER_REGISTERED",
            targetRole: "admin",
            channels: ["WEBSOCKET"],
            data,
        });

        // 2. Notifikasi Super Admin
        await this._sendNotificationUseCase.execute({
            title: "Pengguna Baru Terdaftar",
            message: `Pengguna ${data.fullname} (@${data.username}) baru saja bergabung!`,
            type: "USER_REGISTERED",
            targetRole: "super_admin",
            channels: ["WEBSOCKET"],
            data,
        });
    }
}