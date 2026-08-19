import { Request, Response, NextFunction } from "express";
import { GetUserNotificationsUseCase } from "@/applications/usecase/notification/get-user-notifications";
import { MarkNotificationReadUseCase } from "@/applications/usecase/notification/mark-notification-read";
import { LoggerService } from "@/applications/logger/logger-service";

interface NotificationHandlerDependencies {
    getUserNotificationsUseCase: GetUserNotificationsUseCase;
    markNotificationReadUseCase: MarkNotificationReadUseCase;
    logger: LoggerService;
}

export class NotificationHandler {
    private _getUserNotificationsUseCase: GetUserNotificationsUseCase;
    private _markNotificationReadUseCase: MarkNotificationReadUseCase;
    private _logger: LoggerService;

    constructor(deps: NotificationHandlerDependencies) {
        this._getUserNotificationsUseCase = deps.getUserNotificationsUseCase;
        this._markNotificationReadUseCase = deps.markNotificationReadUseCase;
        this._logger = deps.logger;

        this.getNotificationsHandler = this.getNotificationsHandler.bind(this);
        this.markAsReadHandler = this.markAsReadHandler.bind(this);
        this.markAllAsReadHandler = this.markAllAsReadHandler.bind(this);
    }

    async getNotificationsHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;

            const notifications = await this._getUserNotificationsUseCase.execute(userId, role);

            res.status(200).json({
                status: "success",
                data: {
                    notifications,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    async markAsReadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id as string;

            await this._markNotificationReadUseCase.execute(id);

            res.status(200).json({
                status: "success",
                message: "Notifikasi berhasil ditandai sebagai dibaca",
            });
        } catch (error) {
            next(error);
        }
    }

    async markAllAsReadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.id;
            const role = req.user!.role;

            await this._markNotificationReadUseCase.executeReadAll(userId, role);

            res.status(200).json({
                status: "success",
                message: "Semua notifikasi berhasil ditandai sebagai dibaca",
            });
        } catch (error) {
            next(error);
        }
    }
}
