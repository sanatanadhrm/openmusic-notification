import http from "http";
import { config } from "./commons/config";
import logger from "./infrastructures/logger/winston/winston-config";
import { createServer } from "./infrastructures/http/create-server";
import { createSocket } from "./infrastructures/socket/create-socket";
import { container } from "./infrastructures/container";
import { createBroker } from "./infrastructures/message/create-broker";

(async () => {
    try {
        // 1. Inisialisasi HTTP / Express App
        const app = await createServer(container);
        const httpServer = http.createServer(app);

        // 2. Inisialisasi WebSocket / Socket.io Server (Otomatis mendaftarkan WebSocketSender ke Dispatcher)
        await createSocket(httpServer, container);

        // 3. Inisialisasi RabbitMQ Consumers (Modular Event Routing)
        await createBroker(container);

        // 4. Start HTTP + WebSocket Server
        httpServer.listen(config.app.port, () => {
            logger.info(
                `Notification Service & Socket.io running on http://${config.app.host}:${config.app.port}`
            );
        });
    } catch (error) {
        logger.error("Gagal menjalankan Notification Service:", error);
        process.exit(1);
    }
})();
