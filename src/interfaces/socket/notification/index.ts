// src/interfaces/socket/notification/index.ts
import { Server, Socket } from "socket.io";
import { Container } from "instances-container";
import { NotificationSocketHandler } from "./handler";
import { routes } from "./routes";
import { MarkNotificationReadUseCase } from "@/applications/usecase/notification/mark-notification-read";
import { WinstonLoggerService } from "@/infrastructures/logger/winston/winston-service";

export default (container: Container) => {
    // 1. Resolve Use Case dari Container
    const markNotificationReadUseCase = container.getInstance(
        MarkNotificationReadUseCase.name
    ) as MarkNotificationReadUseCase;
    const logger = container.getInstance(
        WinstonLoggerService.name
    ) as WinstonLoggerService;

    // 2. Buat Handler
    const handler = new NotificationSocketHandler(markNotificationReadUseCase, logger);

    // 3. Return fungsi pemasang route untuk setiap socket koneksi baru
    return (io: Server, socket: Socket) => {
        routes(io, socket, handler);
    };
};