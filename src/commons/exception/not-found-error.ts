import { ClientError } from "./client-error";

export class NotFoundError extends ClientError {
    constructor(message: string) {
        super(message, 404);
        this.name = "NotFoundError";
    }
}
