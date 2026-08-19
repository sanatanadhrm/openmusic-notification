import { ClientError } from "./client-error";

export class AuthorizationError extends ClientError {
    constructor(message: string = "Anda tidak berhak mengakses resource ini") {
        super(message, 403);
        this.name = "AuthorizationError";
    }
}
