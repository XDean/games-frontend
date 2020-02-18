export const LCCardColors = [0, 1, 2, 3, 4];
export type LCCardColor = 0 | 1 | 2 | 3 | 4;
export type LCCardPoint = "double" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export class LCCard {
    readonly color: LCCardColor;
    readonly point: LCCardPoint;

    constructor(
        readonly int: number
    ) {
        this.color = Math.floor(int / 12) as LCCardColor;
        this.point = int % 12 < 3 ? "double" : int % 12 - 1 as LCCardPoint;
    }
}