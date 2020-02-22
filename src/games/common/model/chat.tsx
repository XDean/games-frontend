import {SimpleProperty} from "xdean-util";
import {SocketInit, SocketTopicHandler, SocketTopicSender} from "./socket";
import React from "react";


export type ChatMessage = {
    who: string
    content: any
}

export class ChatController implements SocketTopicHandler, SocketInit {
    readonly messages = new SimpleProperty<ChatMessage[]>([]);

    handle = (topic: string, data: any): void => {
        console.log("accept", topic, data);
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

    init = (sender: SocketTopicSender) => {
        sender.send("chat-history");
    };
}