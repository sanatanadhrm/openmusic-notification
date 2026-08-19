import { Router } from "express";
import { NotificationHandler } from "./handler";
import { authenticateJWT } from "@/infrastructures/http/middleware/auth-jwt";

export const routes = (router: Router, handler: NotificationHandler) => {
    router.get("/", authenticateJWT, handler.getNotificationsHandler);
    router.patch("/read-all", authenticateJWT, handler.markAllAsReadHandler);
    router.patch("/:id/read", authenticateJWT, handler.markAsReadHandler);
};
