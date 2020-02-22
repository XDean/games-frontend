import {LCCards} from "./card"
import {MultiGameBoard, MultiGamePlayer, MultiGameWatcher} from "../../common/model/multi-game";
import {wither} from "../../common/util/util";
import {LCPlayerScore} from "./score";

export type LCCardBoard = LCCards[]

export class LCGameBoard implements MultiGameBoard {

    static create(): LCGameBoard {
        return new LCGameBoard("wait", 0, [], [], false, 0, 0, [], [], [])
    }

    constructor(
        readonly state: "wait" | "play" | "watch",
        readonly mySeat: number,
        readonly players: MultiGamePlayer[],
        readonly watchers: MultiGameWatcher[],
        readonly over: boolean,
        readonly current: number,
        readonly deck: number,
        readonly drop: LCCardBoard,
        readonly board: LCCardBoard[],
        readonly hand: LCCards[]
    ) {
    }

    with = wither(this);

    calcScore = (): LCPlayerScore[] => {
        return this.board.map(b => new LCPlayerScore(b))
    }
}