import { NotificationRepository } from "@/domains/notification/notification-repository";
import { CreateNotificationPayload } from "@/domains/notification/entities/payload/create-notification";
import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";
import { PrismaClient } from "../../database/postgresql/generated/prisma/client";
import { LoggerService } from "@/applications/logger/logger-service";

export class NotificationRepositoryPrisma implements NotificationRepository {
    constructor(
        private _prisma: PrismaClient,
        private _logger: LoggerService
    ) {}

    async create(payload: CreateNotificationPayload): Promise<NotificationDetail> {
        this._logger.info("NotificationRepositoryPrisma: Menyimpan notifikasi ke database");
        const result = await this._prisma.notification.create({
            data: {
                userId: payload.userId || null,
                targetRole: payload.targetRole || null,
                title: payload.title,
                message: payload.message,
                type: payload.type,
                channels: payload.channels || ["WEBSOCKET"],
                data: payload.data ? payload.data : undefined,
            }
        });

        return result as unknown as NotificationDetail;
    }

    async getByUserOrRole(userId: string, role: string): Promise<NotificationDetail[]> {
        this._logger.info(`NotificationRepositoryPrisma: Mengambil notifikasi untuk user [${userId}] role [${role}]`);
        const results = await this._prisma.notification.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { targetRole: role }
                ]
            },
            orderBy: { createdAt: "desc" }
        });

        return results as unknown as NotificationDetail[];
    }

    async markAsRead(id: string): Promise<void> {
        this._logger.info(`NotificationRepositoryPrisma: Menandai notifikasi [${id}] dibaca`);
        await this._prisma.notification.update({
            where: { id },
            data: { isRead: true, readAt: new Date() }
        });
    }

    async markAllAsRead(userId: string, role: string): Promise<void> {
        this._logger.info(`NotificationRepositoryPrisma: Menandai semua notifikasi dibaca untuk user [${userId}]`);
        await this._prisma.notification.updateMany({
            where: {
                OR: [
                    { userId: userId },
                    { targetRole: role }
                ],
                isRead: false
            },
            data: { isRead: true, readAt: new Date() }
        });
    }

    async countUnread(userId: string, role: string): Promise<number> {
        return this._prisma.notification.count({
            where: {
                OR: [
                    { userId: userId },
                    { targetRole: role }
                ],
                isRead: false
            }
        });
    }
}
