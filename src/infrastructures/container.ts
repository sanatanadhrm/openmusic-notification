import { createContainer } from "instances-container";
import { postgresql } from "./database/postgresql";
import { WinstonLoggerService } from "./logger/winston/winston-service";
import { NotificationRepositoryPrisma } from "./repository/prisma/notification-repository";
import { NotificationDispatcher } from "@/infrastructures/dispatcher/notification-dispatcher";
import { SendNotificationUseCase } from "@/applications/usecase/notification/send-notification-usecase";
import { GetUserNotificationsUseCase } from "@/applications/usecase/notification/get-user-notifications";
import { MarkNotificationReadUseCase } from "@/applications/usecase/notification/mark-notification-read";

const container = createContainer();

// ==========================================
// 1. REGISTER INFRASTRUCTURE
// ==========================================
container.register([
    {
        key: WinstonLoggerService.name,
        Class: WinstonLoggerService,
        parameter: { dependencies: [] },
    },
    {
        key: NotificationRepositoryPrisma.name,
        Class: NotificationRepositoryPrisma,
        parameter: {
            dependencies: [
                { concrete: postgresql },
                { internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: NotificationDispatcher.name,
        Class: NotificationDispatcher,
        parameter: {
            dependencies: [
                { internal: WinstonLoggerService.name },
            ],
        },
    },
]);

// ==========================================
// 2. REGISTER USE CASES
// ==========================================
container.register([
    {
        key: SendNotificationUseCase.name,
        Class: SendNotificationUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "notificationRepository", internal: NotificationRepositoryPrisma.name },
                { name: "notificationDispatcher", internal: NotificationDispatcher.name },
                { name: "logger", internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: GetUserNotificationsUseCase.name,
        Class: GetUserNotificationsUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "notificationRepository", internal: NotificationRepositoryPrisma.name },
                { name: "logger", internal: WinstonLoggerService.name },
            ],
        },
    },
    {
        key: MarkNotificationReadUseCase.name,
        Class: MarkNotificationReadUseCase,
        parameter: {
            injectType: "destructuring",
            dependencies: [
                { name: "notificationRepository", internal: NotificationRepositoryPrisma.name },
                { name: "logger", internal: WinstonLoggerService.name },
            ],
        },
    },
]);

export { container };
