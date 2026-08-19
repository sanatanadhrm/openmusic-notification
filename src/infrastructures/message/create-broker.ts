// src/infrastructures/message/rabbitmq/create-broker.ts
import amqp from "amqplib";
import { Container } from "instances-container";
import { config } from "@/commons/config";
import logger from "@/infrastructures/logger/winston/winston-config";
import { RabbitMQApp } from "./rabbitmq/rabbitmq";
import userQueue from "@/interfaces/message/rabbitmq/user-queue";

export const createBroker = async (container: Container): Promise<RabbitMQApp> => {
    try {
        // 1. Langsung buka koneksi & channel AMQP di sini


        logger.info("RabbitMQ: Terhubung ke broker dan channel siap digunakan");

        // 2. Inisialisasi Aplikasi Broker (dengan channel yang baru dibuat)
        const broker = new RabbitMQApp({
            serverUrl: config.rabbitmq.server || "amqp://localhost",
            logger,
        });
        // 3. Daftarkan antrean-antrean (Persis seperti app.use di Express)
        broker.useQueue(userQueue(container));

        // 🚀 Jika kelak ada antrean lain, tinggal tambah 1 baris:
        // brokerApp.useQueue(orderQueue(container));
        // brokerApp.useQueue(catalogQueue(container));

        // 4. Mulai mendengarkan seluruh antrean yang terdaftar
        await broker.listen();

        // 5. Graceful Shutdown (Tutup koneksi jika server Node.js dihentikan / ctrl+c)
        const handleShutdown = async () => {
            logger.info("RabbitMQ: Menutup channel dan koneksi...");
            await broker.close();
        };
        process.on("SIGINT", handleShutdown);
        process.on("SIGTERM", handleShutdown);

        return broker;
    } catch (error) {
        logger.error("RabbitMQ: Gagal menginisialisasi broker:", error);
        throw error;
    }
};