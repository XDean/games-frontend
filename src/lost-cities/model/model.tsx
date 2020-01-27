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
    currentId = new SimpleProperty(0);
    deck = new SimpleProperty<number>(0);
    myBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    otherBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    dropBoard = new SimpleProperty<LCCard[][]>(LCGame.emptyBoard());
    myHand = new SimpleProperty<LCCard[]>([]);

    constructor(
        readonly  myId: number,
    ) {
    }

    static emptyBoard(): LCCard[][] {
        return [[], [], [], [], []]
    }
}