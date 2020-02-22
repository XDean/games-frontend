export interface SocketInit {
    init(sender: SocketTopicSender): void
}

export interface SocketTopicHandler {
    handle(topic: string, data: any): void
}

export interface SocketTopicSender {
    send(topic: string, data?: any): void
}

export const EmptyTopicSender: SocketTopicSender = {
    send: (topic: string, data: any) => {
    }
};