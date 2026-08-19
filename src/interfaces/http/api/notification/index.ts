import { Router } from "express";
import { Container } from "instances-container";
import { NotificationHandler } from "./handler";
import { routes } from "./routes";
import { GetUserNotificationsUseCase } from "@/applications/usecase/notification/get-user-notifications";
import { MarkNotificationReadUseCase } from "@/applications/usecase/notification/mark-notification-read";
import { WinstonLoggerService } from "@/infrastructures/logger/winston/winston-service";

export default (container: Container) => {
    const router = Router();

    const getUserNotificationsUseCase = container.getInstance(
        GetUserNotificationsUseCase.name
    ) as GetUserNotificationsUseCase;
    const markNotificationReadUseCase = container.getInstance(
        MarkNotificationReadUseCase.name
    ) as MarkNotificationReadUseCase;
    const logger = container.getInstance(
        WinstonLoggerService.name
    ) as WinstonLoggerService;

    const handler = new NotificationHandler({
        getUserNotificationsUseCase,
        markNotificationReadUseCase,
        logger,
    });

    routes(router, handler);

    return router;
};
