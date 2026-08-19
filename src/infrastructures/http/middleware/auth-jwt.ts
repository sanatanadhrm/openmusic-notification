import { config } from "@/commons/config";
import { AuthenticationError } from "@/commons/exception/authentication-error";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "@/infrastructures/logger/winston/winston-config";
import { UserTokenPayload } from "@/commons/types";

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    try {
        // Cek header dari API Gateway jika diteruskan
        if (req.headers["x-user-id"] && req.headers["x-user-role"]) {
            req.user = {
                id: req.headers["x-user-id"] as string,
                username: (req.headers["x-user-username"] as string) || "",
                role: req.headers["x-user-role"] as string,
            };
            return next();
        }

        const authHeader = req.header("Authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
            logger.warn("[authenticateJWT] Access token missing from request headers");
            throw new AuthenticationError("Access token tidak ditemukan");
        }

        try {
            const verified = jwt.verify(token, config.token.accessTokenKey) as UserTokenPayload;
            req.user = verified;
            next();
        } catch (error) {
            logger.warn("[authenticateJWT] Invalid access token provided");
            throw new AuthenticationError("Access token tidak valid");
        }
    } catch (err) {
        next(err);
    }
}
