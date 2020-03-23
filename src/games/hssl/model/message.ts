import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {HSSLCard, HSSLItem, HSSLStatus} from "./game";
import {MultiGamePlayer} from "../../common/model/multi-player/host";

export type HSSLMessage =
    string
    | MultiPlayerMessage
    | HSSLSetMessage
    | HSSLBuyMessage
    | HSSLSwapMessage
    | HSSLBanyunMessage
    | HSSLSkipMessage
    | HSSLPlayMessage
    | HSSLDrawMessage
    | HSSLBiyueMessage
    | HSSLStatusMessage
    | HSSLOverMessage

export class HSSLSetMessage {
    constructor(readonly seat: number,
                readonly good: HSSLCard,
                readonly round: number
    ) {
    }
}

export class HSSLBuyMessage {
    constructor(readonly seat: number,
                readonly item: HSSLItem,
                readonly good: HSSLCard) {
    }
}

export class HSSLSwapMessage {
    constructor(readonly seat: number,
                readonly old: HSSLCard[],
                readonly now: HSSLCard[]) {
    }
}

export class HSSLBanyunMessage {
    constructor(readonly seat: number,
                readonly old: HSSLCard,
                readonly now: HSSLCard) {
    }
}

export class HSSLSkipMessage {

    constructor(readonly seat: number) {
    }
}

export class HSSLPlayMessage {
    constructor(readonly seat: number,
                readonly card: HSSLCard,
                readonly count: number,
                readonly was: HSSLCard[],
                readonly guanshui: boolean[],
                readonly revenue: number[]) {
    }
}

export class HSSLDrawMessage {
    constructor(readonly seat: number,
                readonly known: boolean,
                readonly cards: HSSLCard[]) {
    }
}

export class HSSLBiyueMessage {
    constructor(readonly seat: number,
                readonly known: boolean,
                readonly card: HSSLCard) {
    }
}

export class HSSLStatusMessage {
    constructor(readonly seat: number,
                readonly status: HSSLStatus,
                readonly wasSeat: number) {
    }
}

export class HSSLOverMessage {
    constructor(
        readonly players: MultiGamePlayer[],
        readonly points: number[],
    ) {
    }

    getWinners = () => {
        let winners: string[] = [];
        let max = this.points.reduce((a, b) => a > b ? a : b, 0);
        this.points.forEach((point, index) => {
            if (point === max) {
                winners.push(this.players[index].id)
            }
        });
        return winners
    }
}