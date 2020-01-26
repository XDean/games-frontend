import {LCCard, LCGame} from "./model";

export function randomCard(): LCCard {
    if (Math.random() > 0.9) {
        return new LCCard("unknown");
    }
    return new LCCard(randInt(5), randomPoint());
}

function randomPoint() {
    let point = randInt(9);
    return point === 0 ? "double" : point + 1;
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

export function mockGame(): LCGame {
    let board = new LCGame(0);
    board.currentId.value = 0;
    board.deck.value = 30;
    board.myBoard.value = randomBoard();
    board.otherBoard.value = randomBoard();
    board.dropBoard.value = randomBoard();
    board.myHand.value = randomCards(7);
    return board;
}

function randomBoard(): LCCard[][] {
    let res: LCCard[][] = LCGame.emptyBoard();
    for (let i = 0; i < 5; i++) {
        let count = randInt(5);
        while (count-- > 0) {
            res[i].push(new LCCard(i, randomPoint()));
        }
    }
    return res
}