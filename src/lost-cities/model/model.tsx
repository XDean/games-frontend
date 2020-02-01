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