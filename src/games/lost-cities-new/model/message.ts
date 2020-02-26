import {LCCard} from "./card";
import {LCDrawType} from "./board";

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