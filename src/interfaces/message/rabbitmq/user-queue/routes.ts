import { BrokerRouter } from "@/infrastructures/message/middleware/broker-router";
import { UserQueueHandler } from "./handler";
import { USER_QUEUE } from "@/domains/user/entities/constants/queue-key";

export const routes = (router: BrokerRouter, handler: UserQueueHandler) => {
    router.on(USER_QUEUE.EVENT.CREATE_USER, handler.handleUserRegistered);
};