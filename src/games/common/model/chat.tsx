import {SimpleProperty} from "xdean-util";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "./socket";
import React from "react";


export type ChatMessage = {
    who: string
    content: any
}

export class ChatController implements SocketTopicHandler, SocketInit {
    readonly messages = new SimpleProperty<ChatMessage[]>([]);
    private sender = EmptyTopicSender;

    init = (sender: SocketTopicSender) => {
        this.sender = sender;
        sender.send("chat-history");
    };

    handle = (topic: string, data: any): void => {
        if (topic === "chat") {
            this.messages.update(msgs => {
                msgs.push({
                    who: data.id,
                    content: data.text,
                })
            })
        } else if (topic === "chat-history") {
            this.messages.value = data.map((d: any) => ({who: d.id, content: d.text}))
        }
    };

    sendMessage = (msg: string) => {
        this.sender.send("chat", msg);
    }
}