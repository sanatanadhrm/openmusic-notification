// src/infrastructures/message/rabbitmq/create-broker.ts
import { Container } from "instances-container";
import { RabbitMQConnection } from "./rabbitmq-connection";
import { RabbitMQListener } from "./rabbitmq-listener";
import { WinstonLoggerService } from "@/infrastructures/logger/winston/winston-service";
import { USER_QUEUE } from "@/domains/user/entities/constants/queue-key";
import { userQueue } from "@/interfaces/message/rabbitmq/user-queue";

export const createBroker = async (container: Container) => {
    const logger = container.getInstance(WinstonLoggerService.name)

    try {

        const brokerConn = container.getInstance(RabbitMQConnection.name) as RabbitMQConnection;
        await brokerConn.connect();
        logger.info("RabbitMQ: Terhubung ke broker dan channel siap digunakan");
        const brokerListener = container.getInstance(RabbitMQListener.name) as RabbitMQListener;

        brokerListener.useQueue({
            queueName: USER_QUEUE.BASE,
            router: userQueue(container)
        })
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