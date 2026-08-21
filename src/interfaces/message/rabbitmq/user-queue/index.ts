import { Container } from "instances-container";
import { UserQueueHandler } from "./handler";
import { routes } from "./routes";
import { SendNotificationUseCase } from "@/applications/usecase/notification/send-notification-usecase";
import { WinstonLoggerService } from "@/infrastructures/logger/winston/winston-service";
import { BrokerRouter } from "@/infrastructures/message/middleware/broker-router";

export const userQueue = (container: Container): BrokerRouter => {
    const router = new BrokerRouter();

    // 1. Resolve Use Case dari Container
    const sendNotificationUseCase = container.getInstance(
        SendNotificationUseCase.name
    ) as SendNotificationUseCase;
    const logger = container.getInstance(
        WinstonLoggerService.name
    ) as WinstonLoggerService;

    // 2. Buat Handler
    const handler = new UserQueueHandler(sendNotificationUseCase, logger);

    // 3. Pasang Routes
    routes(router, handler);

    // 4. Return nama antrean dan routernya
    return router
};