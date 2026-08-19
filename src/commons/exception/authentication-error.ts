import { ClientError } from "./client-error";

export class AuthenticationError extends ClientError {
    constructor(message: string = "Authentication failed") {
        super(message, 401);
        this.name = "AuthenticationError";
    }
}
