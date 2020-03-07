import {MultiGamePlayer} from "./host";

export type MultiPlayerMessage = JoinMessage | WatchMessage | ReadyMessage | HostMessage | SwapSeatMessage

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

export class SwapSeatMessage {
    constructor(
        readonly from: MultiGamePlayer, readonly to: MultiGamePlayer
    ) {
    }
}

export enum HostMessage {
    START = "MultiPlayer.START",
    OVER = "MultiPlayer.OVER",
    CONTINUE = "MultiPlayer.RECONNECT",
}