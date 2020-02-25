import {LCCardBoard} from "./board";
import {LCCards} from "./card";

export class LCSingleScore {
    readonly develop: boolean;
    readonly times: number;
    readonly score: number;
    readonly bonus: boolean;
    readonly sum: number;

    constructor(
        cards: LCCards
    ) {
        if (cards.length === 0) {
            this.develop = false;
            this.times = 1;
            this.score = 0;
            this.bonus = false;
            this.sum = 0;
        }
        let score = 0;
        let times = 1;
        let points = 0;
        cards.forEach(c => {
            if (c.isDouble()) {
                times++;
            } else {
                points++;
                score += c.point;
            }
        });
        let bonus = points >= 8;

        this.develop = true;
        this.times = times;
        this.score = score;
        this.bonus = bonus;
        this.sum = times * (score - 20) + (bonus ? 20 : 0);
    }
}

export class LCPlayerScore {

    readonly scores: LCSingleScore[];
    readonly sum: number;

    constructor(
        board: LCCardBoard
    ) {
        this.scores = board.map(cards => new LCSingleScore(cards))
        this.sum = this.scores.reduce((a, b) => a + b.sum, 0);
    }
}