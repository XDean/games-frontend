import {SimpleProperty} from "xdean-util";
import Global from "../../global";

export type LCCardColor = "unknown" | number
export type LCCardPoint = "double" | number

export class LCCard {
    static Colors = [0, 1, 2, 3, 4];

    readonly color: LCCardColor; // 0,1,2,3,4
    readonly point?: LCCardPoint;

    constructor(
        readonly int: number,
        colorOnly?: number,
    ) {
        if (int < 0) {
            this.color = "unknown";
        } else {
            this.color = Math.floor(int / 12);
        }
        this.point = int % 12 < 3 ? "double" : int % 12 - 1;
        if (colorOnly !== undefined) {
            this.color = colorOnly;
            this.point = undefined;
        }
    }

    static unknowns(i: number): LCCard[] {
        let res: LCCard[] = [];
        while (i-- > 0) {
            res.push(new LCCard(-1));
        }
        return res
    }

    colorNumber = (): number => {
        return this.color === "unknown" ? -1 : this.color;
    };

    pointNumber = (): number => {
        return this.point === "double" ? 0 : this.point || -1;
    };
}

export class LCGame {

    gameId = new SimpleProperty<string>("");
    player = new SimpleProperty<LCPlayer>(LCPlayer.EMPTY);

    mySeat = new SimpleProperty<number>(-1);
    currentSeat = new SimpleProperty(-1);
    deck = new SimpleProperty<number>(-1);
    myBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    otherBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    dropBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    myHand = new SimpleProperty<LCCard[]>([]);

    messages = new SimpleProperty<string[]>([]);

    constructor() {
        this.currentSeat.addListener(() => {
            this.addMessage(`轮到玩家：${this.getCurrentPlayerId()}`);
        })
    }

    static emptyBoard(): LCCard[][] {
        return [[], [], [], [], []]
    }

    isMyTurn = () => {
        return this.currentSeat.value === this.mySeat.value;
    };

    addMessage = (msg: string) => {
        this.messages.update(msgs => {
            return [...msgs, msg]
        })
    };

    getCurrentPlayerId = (): string => {
        return this.isMyTurn() ? Global.id : this.player.value.id
    }
}

export class LCPlayer {
    static EMPTY = new LCPlayer("", 0, false, false);

    constructor(
        public id: string,
        public seat: number,
        public connected: boolean,
        public ready: boolean,
    ) {
    }
}