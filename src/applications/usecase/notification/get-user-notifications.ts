import { NotificationRepository } from "@/domains/notification/notification-repository";
import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";
import { LoggerService } from "@/applications/logger/logger-service";

interface GetUserNotificationsUseCaseDependencies {
    notificationRepository: NotificationRepository;
    logger: LoggerService;
}

export class GetUserNotificationsUseCase {
    private _notificationRepository: NotificationRepository;
    private _logger: LoggerService;

    constructor(deps: GetUserNotificationsUseCaseDependencies) {
        this._notificationRepository = deps.notificationRepository;
        this._logger = deps.logger;
    }

    async execute(userId: string, role: string): Promise<NotificationDetail[]> {
        this._logger.info(`GetUserNotificationsUseCase: Mengambil notifikasi untuk user [${userId}] role [${role}]`);
        return this._notificationRepository.getByUserOrRole(userId, role);
    }
}
