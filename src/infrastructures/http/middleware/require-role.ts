import { AuthorizationError } from "@/commons/exception/authorization-error";
import { Request, Response, NextFunction } from "express";

export function requireRole(allowedRoles: string[]) {
    return (req: Request, _res: Response, next: NextFunction): void => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            return next(new AuthorizationError("Anda tidak memiliki izin untuk mengakses resource ini"));
        }

        next();
    };
}
