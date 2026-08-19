export interface CreateNotificationPayload {
    userId?: string | null;
    targetRole?: string | null; // "admin" | "super_admin"
    title: string;
    message: string;
    type: string;               // e.g. "USER_REGISTERED"
    channels?: ('WEBSOCKET' | 'EMAIL' | 'WHATSAPP')[];
    data?: Record<string, any> | null;
}