import winston from "winston";
import { config } from "@/commons/config";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message}`;
    if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
});

const logger = winston.createLogger({
    level: config.app.env === "development" ? "debug" : "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export default logger;
