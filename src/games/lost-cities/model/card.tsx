export const LCCardColors: LCCardColor[] = [0, 1, 2, 3, 4];
export type LCCardColor = 0 | 1 | 2 | 3 | 4;
export type LCCardPoint = 0 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class LCCard {
    readonly color: LCCardColor;
    readonly point: LCCardPoint;

    constructor(
        readonly int: number
    ) {
        this.color = Math.floor(int / 12) as LCCardColor;
        this.point = int % 12 < 3 ? 0 : int % 12 - 1 as LCCardPoint;
    }

    static colorOnly(color: LCCardColor): LCCard {
        return new LCCard(color * 12);
    }

    isDouble = () => {
        return this.point === 0;
    }
}

export type LCCards = LCCard[]

export function createCards(count: number): LCCards {
    let res = [];
    for (; count-- > 0;)
        res.push(new LCCard(0));
    return res;
}