import {SimpleProperty} from "xdean-util";
import {SocketEventHandler} from "./socket";


export type Message = {
    who: string
    content: any
}

export class ChatPlugin implements SocketEventHandler {
    readonly messages = new SimpleProperty<Message[]>([]);

    handle = (topic: string, data: any): void => {
    }
}