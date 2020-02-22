export interface SocketEventHandler {
    handle(topic: string, data: any): void
}