import { NotificationRepository } from "@/domains/notification/notification-repository";
import { CreateNotificationPayload } from "@/domains/notification/entities/payload/create-notification";
import { NotificationDetail } from "@/domains/notification/entities/response/notification-detail";
import { LoggerService } from "@/applications/logger/logger-service";
import { Dispatcher } from "@/applications/dispatcher/dispatcher";

interface SendNotificationUseCaseDependencies {
    notificationRepository: NotificationRepository;
    notificationDispatcher: Dispatcher;
    logger: LoggerService;
}

export class SendNotificationUseCase {
    private _notificationRepository: NotificationRepository;
    private _notificationDispatcher: Dispatcher;
    private _logger: LoggerService;

    constructor(deps: SendNotificationUseCaseDependencies) {
        this._notificationRepository = deps.notificationRepository;
        this._notificationDispatcher = deps.notificationDispatcher;
        this._logger = deps.logger;
    }

    async execute(payload: CreateNotificationPayload): Promise<NotificationDetail> {
        this._logger.info(`SendNotificationUseCase: Menyimpan & mengirim notifikasi tipe [${payload.type}]`);

        // 1. Simpan ke database
        const savedNotification = await this._notificationRepository.create(payload);

        // 2. Pancarkan ke channel aktif (WebSocket, dan masa depan: Email, WA)
        await this._notificationDispatcher.dispatch(savedNotification);

        return savedNotification;
    }
}
