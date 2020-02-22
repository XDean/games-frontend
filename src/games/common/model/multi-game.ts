import {wither} from "../util/util";

export abstract class MultiGameBoard {
    abstract readonly state: "wait" | "play" | "watch";
    abstract readonly mySeat: number;
    abstract readonly players: MultiGamePlayer[];
    abstract readonly watchers: MultiGameWatcher[];
}

export class MultiGamePlayer {
    static EMPTY = new MultiGamePlayer("", 0, false, false);

    constructor(
        readonly id: string,
        readonly seat: number,
        readonly connected: boolean,
        readonly ready: boolean,
    ) {
    }

    isEmpty = (): boolean => {
        return this.id === "";
    };

    with = wither(this)
}

export class MultiGameWatcher {
    constructor(
        readonly id: string,
        readonly connected: boolean,
    ) {
    }

    with = wither(this)
}