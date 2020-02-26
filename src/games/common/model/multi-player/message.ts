export type MultiPlayerMessage = JoinMessage | WatchMessage | ReadyMessage | StartMessage | OverMessage

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

export class StartMessage {
}

export class OverMessage {
}