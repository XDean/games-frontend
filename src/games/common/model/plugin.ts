import {SocketInit, SocketTopicHandler, SocketTopicSender} from "./socket";

export abstract class SocketPlugin implements SocketTopicHandler, SocketInit {
    abstract handle: (topic: string, data: any) => void;

    abstract init: (sender: SocketTopicSender) => void;
}