export interface UserTokenPayload {
    id: string;
    username: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserTokenPayload;
        }
    }
}
