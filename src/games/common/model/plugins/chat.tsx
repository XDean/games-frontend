import {SimpleProperty} from "xdean-util";
import {EmptyTopicSender, SocketTopicSender} from "../socket";
import {SocketPlugin} from "./plugin";

export const ChatTopics = {
    Message: "chat-message",
    History: "chat-history",
};

export type ChatMessage = {
    who: string
    content: any
}

export class ChatPlugin extends SocketPlugin {
    readonly messages = new SimpleProperty<ChatMessage[]>([]);
    private sender = EmptyTopicSender;

    init = (sender: SocketTopicSender) => {
        this.sender = sender;
        sender.send(ChatTopics.History);
    };

    handle = (topic: string, data: any): void => {
        if (topic === ChatTopics.Message) {
            this.messages.update(msgs => {
                msgs.push({
                    who: data.id,
                    content: data.text,
                })
            })
        } else if (topic === ChatTopics.History) {
            this.messages.value = data.map((d: any) => ({who: d.id, content: d.text}))
        }
    };

    sendMessage = (msg: string) => {
        this.sender.send(ChatTopics.Message, msg);
    }
}