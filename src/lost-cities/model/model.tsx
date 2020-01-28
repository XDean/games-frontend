import {SimpleProperty} from "xdean-util";

export class LCCard {
    static Colors = [0, 1, 2, 3, 4];

    constructor(
        readonly color: "unknown" | number, // 0,1,2,3,4
        readonly point?: "double" | number
    ) {
    }

    static unknowns(i: number): LCCard[] {
        let res: LCCard[] = [];
        while (i-- > 0) {
            res.push(new LCCard("unknown"));
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

    gameId = new SimpleProperty<number>(0);
    player = new SimpleProperty<LCPlayer>(LCPlayer.EMPTY);

    mySeat = new SimpleProperty<number>(0);
    currentSeat = new SimpleProperty(0);
    deck = new SimpleProperty<number>(0);
    myBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    otherBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    dropBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    myHand = new SimpleProperty<LCCard[]>([]);

    static emptyBoard(): LCCard[][] {
        return [[], [], [], [], []]
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