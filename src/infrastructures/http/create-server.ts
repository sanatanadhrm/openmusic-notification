import express, { json, urlencoded } from "express";
import { Container } from "instances-container";
import notificationApi from "@/interfaces/http/api/notification";
import { errorHandler } from "./middleware/pre-response";
import morganMiddleware from "./middleware/logger";
import { CorsMiddleware } from "./middleware/cors";

export const createServer = async (container: Container) => {
    const app = express();

    // Logger
    app.use(morganMiddleware);

    // Body parser
    app.use(json());
    app.use(urlencoded({ extended: true }));

    // CORS
    app.use(CorsMiddleware());

    // Health check
    app.get("/health", (_req, res) => {
        res.status(200).json({ status: "OK", service: "openmusic-notification-service" });
    });

    // Mount API Routes
    app.use("/notifications", notificationApi(container));

    // Centralized Error Handler
    app.use(errorHandler);

    return app;
};
