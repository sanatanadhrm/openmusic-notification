// src/interfaces/socket/notification/routes.ts
import { Socket, Server } from "socket.io";
import { NotificationSocketHandler } from "./handler";

export const routes = (io: Server, socket: Socket, handler: NotificationSocketHandler) => {
    // -------------------------------------------------------------
    // A. SETUP ROOMS (Dijalankan sekali saat client baru tersambung)
    // -------------------------------------------------------------
    handler.handleJoinRooms(socket);

    // -------------------------------------------------------------
    // B. EVENT ROUTES (Mendengarkan event dari Client)
    // -------------------------------------------------------------
    // Mirip: router.patch('/:id/read', handler.markAsRead)
    socket.on("notification:mark_as_read", (payload) =>
        handler.handleMarkAsRead(socket, payload)
    );

    // Mirip: router.patch('/read-all', handler.markAllAsRead)
    socket.on("notification:mark_all_read", () =>
        handler.handleMarkAllAsRead(socket)
    );

    // -------------------------------------------------------------
    // C. DISCONNECT EVENT
    // -------------------------------------------------------------
    socket.on("disconnect", (reason) =>
        handler.handleDisconnect(socket, reason)
    );
};