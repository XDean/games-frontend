export class MultiGamePlayer {
    static EMPTY = new MultiGamePlayer("", 0, false, false);

    constructor(
        public id: string,
        public seat: number,
        public connected: boolean,
        public ready: boolean,
    ) {
    }
}