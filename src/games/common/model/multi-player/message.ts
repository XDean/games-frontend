export type MultiPlayerMessage = JoinMessage | WatchMessage | ReadyMessage | HostMessage

export class JoinMessage {
    constructor(readonly who: string) {
    }
}

export class WatchMessage {
    constructor(readonly who: string) {
    }
}

export class ReadyMessage {
    constructor(readonly who: string, readonly ready: boolean) {
    }
}

export enum HostMessage {
    START = "MultiPlayer.START",
    OVER = "MultiPlayer.OVER",
    CONTINUE = "MultiPlayer.RECONNECT",
}