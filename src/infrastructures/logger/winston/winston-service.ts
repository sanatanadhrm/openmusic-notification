import { LoggerService } from "@/applications/logger/logger-service";
import logger from "./winston-config";

export class WinstonLoggerService implements LoggerService {
    info(message: string, ...meta: any[]): void {
        logger.info(message, ...meta);
    }

    error(message: string, ...meta: any[]): void {
        logger.error(message, ...meta);
    }

    warn(message: string, ...meta: any[]): void {
        logger.warn(message, ...meta);
    }

    debug(message: string, ...meta: any[]): void {
        logger.debug(message, ...meta);
    }
}
