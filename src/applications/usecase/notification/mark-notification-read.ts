import { NotificationRepository } from "@/domains/notification/notification-repository";
import { LoggerService } from "@/applications/logger/logger-service";

interface MarkNotificationReadUseCaseDependencies {
    notificationRepository: NotificationRepository;
    logger: LoggerService;
}

export class MarkNotificationReadUseCase {
    private _notificationRepository: NotificationRepository;
    private _logger: LoggerService;

    constructor(deps: MarkNotificationReadUseCaseDependencies) {
        this._notificationRepository = deps.notificationRepository;
        this._logger = deps.logger;
    }

    async execute(id: string): Promise<void> {
        this._logger.info(`MarkNotificationReadUseCase: Menandai notifikasi [${id}] sebagai dibaca`);
        await this._notificationRepository.markAsRead(id);
    }

    async executeReadAll(userId: string, role: string): Promise<void> {
        this._logger.info(`MarkNotificationReadUseCase: Menandai semua notifikasi user [${userId}] role [${role}] sebagai dibaca`);
        await this._notificationRepository.markAllAsRead(userId, role);
    }
}
