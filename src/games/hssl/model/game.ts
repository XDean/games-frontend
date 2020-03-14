import {MultiPlayerBoard} from "../../common/model/multi-player/host";
import {ChatPlugin} from "../../common/model/plugins/chat";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../../common/model/socket";
import {LogPlugin} from "../../common/model/plugins/log";
import {SocketPlugin} from "../../common/model/plugins/plugin";
import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {SimpleProperty} from "xdean-util";

const HSSLTopic = {
    info: "hssl-info",
    set: "hssl-set",
    buy: "hssl-buy",
    swap: "hssl-swap",
    banyun: "hssl-banyun",
    skip: "hssl-skip-swap",
    play: "hssl-play",
    draw: "hssl-draw",
    status: "hssl-status",
};

export enum HSSLStatus {
    Doing = -1,
    Set1 = 0,
    Set2,
    BuySwap,
    BanYun,
    DrawPlay,
    Over,
}

export type HSSLCard = -1 | 0 | 1 | 2 | 3 | 4 | 5;
export const HSSLCards: HSSLCard[] = [0, 1, 2, 3, 4, 5];

export enum HSSLItem {
    GuanShui = 0,
    BanYun = 1,
    BiYue = 2,
    Boat = 3,
}

export const HSSLItems: HSSLItem[] = [3, 0, 1, 2];
export const HSSLSpecialItems: HSSLItem[] = [0, 1, 2];


export class HSSLGame implements SocketTopicHandler, SocketInit {

    private log = new LogPlugin<any>();
    private chat = new ChatPlugin();

    readonly host: MultiPlayerBoard;
    readonly board = new HSSLBoard();

    readonly plugins = {
        log: this.log,
        chat: this.chat,
    };

    private sender = EmptyTopicSender;

    constructor(
        readonly hostId: string,
        readonly myId: string
    ) {
        this.host = new MultiPlayerBoard(myId, this.log as LogPlugin<MultiPlayerMessage>);
        this.host.setPlayerCount(4);
    }

    submit = () => {
        if (this.board.current.value === this.host.mySeat.value && this.host.playing.value && this.host.myRole.value === "play") {
            switch (this.board.status.value) {
                case HSSLStatus.Set1:
                case HSSLStatus.Set2:
                    this.sender.send(HSSLTopic.set, {card: this.board.selected.good1.value});
                    this.board.selected.good1.value = -1;
                    break;
                case HSSLStatus.BuySwap:
                    if (this.board.selected.item.value !== -1) {
                        this.sender.send(HSSLTopic.buy, {
                            item: this.board.selected.item.value,
                            card: this.board.selected.good1.value,
                        });
                        this.board.selected.item.value = -1;
                        this.board.selected.good1.value = -1;
                        break;
                    }
                // fallthrough
                case HSSLStatus.BanYun:
                    if (this.board.selected.boat1.value === -1) {
                        this.sender.send(HSSLTopic.skip);
                    } else {
                        this.sender.send(HSSLTopic.swap, {
                            index1: this.board.selected.boat1.value,
                            card1: this.board.selected.good1.value,
                            index2: this.board.selected.boat2.value,
                            card2: this.board.selected.good2.value,
                        });
                        this.board.selected.boat1.value = -1;
                        this.board.selected.good1.value = -1;
                        this.board.selected.boat2.value = -1;
                        this.board.selected.good2.value = -1;
                    }
                    break;
                case HSSLStatus.DrawPlay:
                    if (this.board.selected.deck.value) {
                        this.sender.send(HSSLTopic.draw, {
                            biyue: false,// TODO
                        });
                        this.board.selected.deck.value = false;
                    }
                    if (this.board.selected.hand.value !== -1 &&
                        this.board.selected.board.value.some(b => b)) {
                        this.sender.send(HSSLTopic.play, {
                            card: this.board.selected.hand.value,
                            dest: this.board.selected.board.value,
                        });
                        this.board.selected.hand.value = -1;
                        this.board.selected.board.update(b => b.fill(false));
                    }
                    break;
                case HSSLStatus.Over:
                    break;
            }
            this.board.status.value = HSSLStatus.Doing;
        }
    };

    init = (sender: SocketTopicSender) => {
        this.sender = sender;
        this.host.init(sender);
        Object.values(this.plugins).forEach(p => {
            if (p instanceof SocketPlugin) {
                p.init(sender);
            }
        });
    };

    handle = (topic: string, data: any): void => {
        this.host.handle(topic, data);
        Object.values(this.plugins).forEach(p => {
            if (p instanceof SocketPlugin) {
                p.handle(topic, data)
            }
        });
        switch (topic) {
            case "room-info":
                this.sender.send(HSSLTopic.info);
                break;
            case HSSLTopic.info:
                this.board.status.value = data.status;
                this.board.current.value = data.current;
                this.board.deck.value = data.deck;
                this.board.items.update(items => {
                    return items.map((v, index) => data.items[index]);
                });
                this.board.goods.update(goods => {
                    return goods.map((v, index) => data.goods[index]);
                });
                this.board.board.value = data.board;
                this.board.players.update(players => {
                    data.players.forEach((p: any) => {
                        let player = players[p.seat];
                        players[p.seat] = {
                            ...player,
                            boats: p.boats.map((v: any) => v === -1 ? -1 : v),
                            handCount: p.hand[-1] || -1,
                            hand: new Array(6).fill(0).map((v, i) => p.hand[i] || 0),
                            items: new Array(3).fill(0).map((v, i) => p.items[i] || false),
                            points: p.points,
                        };
                    });
                });
                break;
            case HSSLTopic.status:
                this.board.status.value = data.status;
                this.board.current.value = data.current;
                break;
            case HSSLTopic.set:
                this.board.goods.update(goods => {
                    goods[data.card]--;
                });
                this.board.players.update(players => {
                    players[data.seat].boats[data.round] = data.card;
                });
                break;
            case HSSLTopic.swap:
                this.board.players.update(players => {
                    this.board.goods.update(goods => {
                        goods[players[data.seat].boats[data.index1] as number]++;
                        goods[data.card1]--;
                        if (data.index2 !== -1) {
                            goods[players[data.seat].boats[data.index2] as number]++;
                            goods[data.card2]--;
                        }
                    });
                    players[data.seat].boats[data.index1] = data.card1;
                    if (data.index2 !== -1) {
                        players[data.seat].boats[data.index2] = data.card2;
                    }
                });
                break;
            case HSSLTopic.skip:
                break;
            case HSSLTopic.draw:
                this.board.deck.update(d => d - data.cards.length);
                this.board.players.update(players => {
                    players[data.seat] = {
                        ...players[data.seat],
                        handCount: players[data.seat].handCount + data.cards.length,
                    };
                    if (data.cards[0] !== -1) {
                        data.cards.forEach((c: any) => {
                            players[data.seat].hand[c]++
                        });
                    }
                });
                break;
            case HSSLTopic.play:
                this.board.board.update(board => {
                    data.dest.forEach((b: any, i: number) => {
                        if (b) {
                            board[i] = data.card;
                        }
                    });
                });
                this.board.players.update(players => {
                    players[data.seat].hand[data.card] -= data.dest.filter((b: any) => b).length;
                    players.forEach(((player, index) => {
                        let revenue = player.boats.filter(c => c === data.card).length * this.board.board.value.filter(c => c === data.card).length;
                        if (revenue !== 0 && player.items[HSSLItem.GuanShui]) {
                            revenue += 2;
                        }
                        if (revenue > 0) {
                            players[index] = {
                                ...player,
                                points: player.points + revenue
                            }
                        }
                    }));
                });
                break;
        }
    };
}

export function ItemCost(item: HSSLItem): number {
    switch (item) {
        case HSSLItem.Boat:
            return 10;
        case HSSLItem.GuanShui:
            return 11;
        case HSSLItem.BanYun:
            return 12;
        case HSSLItem.BiYue:
            return 8;
    }
}

export class HSSLBoard {
    readonly status = new SimpleProperty<HSSLStatus>(HSSLStatus.Set1);
    readonly current = new SimpleProperty<number>(-1);
    readonly deck = new SimpleProperty<number>(66);
    readonly items = new SimpleProperty<number[]>(new Array(3).fill(2));
    readonly goods = new SimpleProperty<number[]>(new Array(6).fill(5));
    readonly board = new SimpleProperty<HSSLCard[]>(new Array(6).fill(-1));
    readonly players = new SimpleProperty<HSSLPlayer[]>(new Array(4).fill(new HSSLPlayer()));

    readonly selected = {
        good1: new SimpleProperty<HSSLCard>(-1),
        good2: new SimpleProperty<HSSLCard>(-1),
        boat1: new SimpleProperty<number>(-1),
        boat2: new SimpleProperty<number>(-1),
        item: new SimpleProperty<HSSLItem | -1>(-1),
        deck: new SimpleProperty<boolean>(false),
        hand: new SimpleProperty<HSSLCard>(-1),
        board: new SimpleProperty<boolean[]>(new Array(6).fill(false)),
    };
}

export class HSSLPlayer {
    readonly boats: HSSLCard[] = [-1, -1];
    readonly handCount: number = 0;
    readonly hand: number[] = new Array(6).fill(0);
    readonly items: boolean[] = new Array(3).fill(false);
    readonly points: number = -1
}