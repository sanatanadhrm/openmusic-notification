// src/interfaces/socket/notification/handler.ts
import { Socket } from "socket.io";
import { MarkNotificationReadUseCase } from "@/applications/usecase/notification/mark-notification-read";
import { LoggerService } from "@/applications/logger/logger-service";

export class NotificationSocketHandler {
    constructor(
        private _markNotificationReadUseCase: MarkNotificationReadUseCase,
        private _logger: LoggerService
    ) { }

    // A. Masukkan user ke room pribadi & role
    handleJoinRooms(socket: Socket): void {
        const user = socket.data.user;
        if (user?.id) socket.join(`user:${user.id}`);
        if (user?.role) socket.join(`role:${user.role}`);
        this._logger.info(`[Socket] User ${user?.username} bergabung ke room user & role`);
    }

    // B. Handler saat user membaca 1 notifikasi
    async handleMarkAsRead(socket: Socket, payload: { notificationId: string }): Promise<void> {
        try {
            await this._markNotificationReadUseCase.execute(payload.notificationId);
            // Balas konfirmasi sukses ke client pengirim
            socket.emit("notification:read_success", { id: payload.notificationId });
        } catch (error) {
            socket.emit("notification:error", { message: "Gagal menandai notifikasi" });
        }
    }

    // C. Handler saat user menandai semua sudah dibaca
    async handleMarkAllAsRead(socket: Socket): Promise<void> {
        try {
            const user = socket.data.user;
            await this._markNotificationReadUseCase.executeReadAll(user.id, user.role);
            socket.emit("notification:read_all_success");
        } catch (error) {
            socket.emit("notification:error", { message: "Gagal menandai semua notifikasi" });
        }
    }

    // D. Handler saat koneksi terputus
    handleDisconnect(socket: Socket, reason: string): void {
        this._logger.info(`[Socket] Client ${socket.id} terputus: ${reason}`);
    }
}