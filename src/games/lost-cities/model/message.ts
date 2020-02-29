import {LCCard} from "./card";
import {LCDrawType} from "./board";
import {LCPlayerScore} from "./score";
import {MultiGamePlayer} from "../../common/model/multi-player/host";

export type LCGameMessage = LCPlayMessage | LCDrawMessage

export class LCPlayMessage {
    constructor(
        readonly seat: number,
        readonly card: LCCard,
        readonly drop: boolean,
    ) {
    }
}

export class LCDrawMessage {
    constructor(
        readonly seat: number,
        readonly type: LCDrawType,
        readonly card?: LCCard,
    ) {
    }
}

export class LCScoreMessage {
    readonly winner: MultiGamePlayer;

    constructor(
        readonly players: MultiGamePlayer[],
        readonly score: LCPlayerScore[], // by seat
    ) {
        this.winner = players.reduce((a, b) => score[a.seat].sum > score[b.seat].sum ? a : b);
    }
}