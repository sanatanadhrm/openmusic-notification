import cors from "cors";

export const CorsMiddleware = () => {
    return cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-user-id", "x-user-role", "x-user-username", "x-internal-api-key"]
    });
};
