import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "@/commons/config";
import { UserTokenPayload } from "@/commons/types";
import logger from "@/infrastructures/logger/winston/winston-config";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token =
            (socket.handshake.auth?.token as string) ||
            (socket.handshake.query?.token as string) ||
            socket.handshake.headers?.authorization?.split(" ")[1];

        if (!token) {
            logger.warn(`[Socket Auth] Koneksi ditolak: Token tidak ditemukan (Socket ID: ${socket.id})`);
            return next(new Error("Authentication error: Token required"));
        }

        const decoded = jwt.verify(token, config.token.accessTokenKey) as UserTokenPayload;
        socket.data.user = decoded;

        logger.info(`[Socket Auth] User terautentikasi: ${decoded.username} (${decoded.id}) dengan role: ${decoded.role}`);
        next();
    } catch (error) {
        logger.warn(`[Socket Auth] Koneksi ditolak: Token tidak valid (Socket ID: ${socket.id})`);
        next(new Error("Authentication error: Invalid token"));
    }
};
