import { BrokerRouter } from "@/infrastructures/message/middleware/broker-router";
import { UserQueueHandler } from "./handler";

export const routes = (router: BrokerRouter, handler: UserQueueHandler) => {
    router.on("USER_REGISTERED", handler.handleUserRegistered);
};