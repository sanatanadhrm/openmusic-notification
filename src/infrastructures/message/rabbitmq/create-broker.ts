// src/infrastructures/message/rabbitmq/create-broker.ts
import { Container } from "instances-container";
import { RabbitMQConnection } from "./rabbitmq-connection";
import { RabbitMQListener } from "./rabbitmq-listener";
import { WinstonLoggerService } from "@/infrastructures/logger/winston/winston-service";

export const createBroker = async (container: Container) => {
    const logger = container.getInstance(WinstonLoggerService.name)

    try {

        const brokerConn = container.getInstance(RabbitMQConnection.name) as RabbitMQConnection;
        await brokerConn.connect();
        logger.info("RabbitMQ: Terhubung ke broker dan channel siap digunakan");
        const brokerListener = container.getInstance(RabbitMQListener.name) as RabbitMQListener;
        await brokerListener.startConsumers();
        const handleShutdown = async () => {
            logger.info("RabbitMQ: Menutup channel dan koneksi...");
            await brokerConn.close();
        };
        process.on("SIGINT", handleShutdown);
        process.on("SIGTERM", handleShutdown);
        return brokerListener;
    } catch (error) {
        logger.error("RabbitMQ: Gagal menginisialisasi broker:", error);
        throw error;
    }
};