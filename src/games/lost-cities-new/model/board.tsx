import {LCCards} from "./card"
import {MultiPlayerBoard} from "../../common/model/multi-player";
import {LCPlayerScore} from "./score";
import {ChatPlugin} from "../../common/model/chat";
import {SimpleProperty} from "xdean-util";
import {SocketEventHandler} from "../../common/model/socket";


export class LCGame implements SocketEventHandler {
    readonly host: MultiPlayerBoard = new MultiPlayerBoard();
    readonly board: LCBoard = new LCBoard();
    readonly plugins = {
        chat: new ChatPlugin()
    };

    constructor(
        readonly id: string
    ) {
        this.host.setPlayerCount(2);
    }

    handle = (topic: string, data: any): void => {
        this.host.handle(topic, data);
        Object.values(this.plugins).forEach(p => {
            p.handle(topic, data)
        });
        switch (topic) {

        }
    };
}

export type LCCardBoard = LCCards[]

export class LCBoard {
    readonly over = new SimpleProperty<boolean>(false);
    readonly current = new SimpleProperty<number>(0);
    readonly deck = new SimpleProperty<number>(0);
    readonly drop = new SimpleProperty<LCCardBoard>([]);
    readonly board = new SimpleProperty<LCCardBoard[]>([]);
    readonly hand = new SimpleProperty<LCCards[]>([]);

    calcScore = (): LCPlayerScore[] => {
        return this.board.value.map(b => new LCPlayerScore(b))
    };
}