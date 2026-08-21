// src/infrastructures/message/rabbitmq/rabbitmq-app.ts
import amqp, { Channel, ChannelModel } from "amqplib";
import { LoggerService } from "@/applications/logger/logger-service";
import { BrokerRouter } from "../middleware/broker-router";

interface RabbitMQAppOptions {
    serverUrl: string;
    logger?: LoggerService;
    prefetch?: number;
}

export class RabbitMQApp {
    private _serverUrl: string;
    private _logger?: LoggerService;
    private _prefetch: number;
    private _connection: ChannelModel | null = null;
    private _channel: Channel | null = null;
    private _queues: Array<{ queueName: string; router: BrokerRouter }> = [];

    constructor(options: RabbitMQAppOptions) {
        this._serverUrl = options.serverUrl;
        this._logger = options.logger;
        this._prefetch = options.prefetch || 10;
    }

    // 1. Mirip app.use() di Express
    useQueue(module: { queueName: string; router: BrokerRouter }): this {
        this._queues.push(module);
        return this;
    }

    // 2. Mirip app.listen() di Express (Orchestrator)
    async listen(): Promise<void> {
        try {
            await this._connectToBroker();
            await this._setupConsumers();
        } catch (error) {
            this._logger?.error("[RabbitMQApp] Gagal menyalakan consumer:", error);
            throw error;
        }
    }

    // 3. Method Graceful Shutdown
    async close(): Promise<void> {
        await this._channel?.close();
        await this._connection?.close();
        this._logger?.info("[RabbitMQApp] Koneksi ditutup.");
    }

    // --- PRIVATE METHODS ---

    /**
     * Bertugas murni untuk membuka koneksi TCP dan membuat Channel AMQP
     */
    private async _connectToBroker(): Promise<void> {
        this._connection = await amqp.connect(this._serverUrl);
        this._channel = await this._connection.createChannel();
        await this._channel.prefetch(this._prefetch);

        this._logger?.info("[RabbitMQApp] Terhubung ke broker dan siap melayani antrean");
    }

    /**
     * Bertugas murni untuk mendaftarkan dan mendengarkan (consume) setiap antrean yang terdaftar
     */
    private async _setupConsumers(): Promise<void> {
        if (!this._channel) {
            throw new Error("Koneksi RabbitMQ belum terbentuk saat setup consumers.");
        }

        for (const { queueName, router } of this._queues) {
            await this._channel.assertQueue(queueName, { durable: true });

            this._channel.consume(queueName, async (msg) => {
                if (!msg) return;

                try {
                    const { event, data } = JSON.parse(msg.content.toString());
                    this._logger?.info(`[RabbitMQApp] Event '${event}' masuk di antrean '${queueName}'`);

                    // Dispatch ke handler yang cocok
                    await router.dispatch(event, data);

                    // ACK pesan
                    this._channel?.ack(msg);
                } catch (err) {
                    this._logger?.error(`[RabbitMQApp] Error memproses pesan di antrean '${queueName}':`, err);
                    this._channel?.nack(msg, false, false);
                }
            });

            this._logger?.info(`[RabbitMQApp] Mendengarkan antrean: '${queueName}'`);
        }
    }
}