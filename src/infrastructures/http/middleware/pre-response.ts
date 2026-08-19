import { ClientError } from "@/commons/exception/client-error";
import { Request, Response, NextFunction } from "express";
import logger from "@/infrastructures/logger/winston/winston-config";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof ClientError) {
        res.status(err.statusCode).json({
            status: "fail",
            message: err.message,
        });
        return;
    }

    logger.error("Unhandled Error:", err);

    res.status(500).json({
        status: "error",
        message: "Terjadi kegagalan pada server kami",
    });
}
