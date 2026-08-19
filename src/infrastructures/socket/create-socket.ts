import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { Container } from "instances-container";
import { NotificationDispatcher } from "@/infrastructures/dispatcher/notification-dispatcher";
import { WebSocketNotificationSender } from "@/infrastructures/realtime/socketio/websocket-sender";
import { WinstonLoggerService } from "@/infrastructures/logger/winston/winston-service";
import logger from "@/infrastructures/logger/winston/winston-config";
import { socketAuthMiddleware } from "./middleware/auth-middleware";
import notificationSocket from "@/interfaces/socket/notification";

export const createSocket = async (httpServer: http.Server, container: Container) => {
    // 1. Inisialisasi Server Socket.io
    const io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PATCH", "DELETE"],
            allowedHeaders: ["Authorization", "x-user-id", "x-user-role"],
        },
    });

    io.use(socketAuthMiddleware);

    // 2. Hubungkan Handler & Event Listener dari Interfaces (Resolve 1x saat startup)
    const registerNotificationSocket = notificationSocket(container);

    // 3. Otomatis Daftarkan WebSocket Sender ke Notification Dispatcher
    const loggerService = container.getInstance(
        WinstonLoggerService.name
    ) as WinstonLoggerService;
    const notificationDispatcher = container.getInstance(
        NotificationDispatcher.name
    ) as NotificationDispatcher;

    notificationDispatcher.registerSender(
        new WebSocketNotificationSender(io, loggerService)
    );

    logger.info("Socket.io Server berhasil diinisialisasi & terdaftar ke Dispatcher");

    // 4. Pasang event listener saat client terhubung
    io.on("connection", (socket) => {
        registerNotificationSocket(io, socket);
    });

    return io;
};