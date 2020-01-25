import {LCCard} from "./model";

export function randomCard(): LCCard {
    if (Math.random() > 0.9) {
        return new LCCard("unknown");
    }
    let point = randInt(10);
    return new LCCard(randInt(5), point === 0 ? "double" : point);
}

export function randomCards(count: number): LCCard[] {
    let res: LCCard[] = [];
    while (count-- > 0) {
        res.push(randomCard());
    }
    return res;
}

function randInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}