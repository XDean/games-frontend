import {MultiPlayerBoard} from "../../common/model/multi-player/host";
import {ChatPlugin} from "../../common/model/plugins/chat";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../../common/model/socket";
import {LogPlugin} from "../../common/model/plugins/log";
import {SocketPlugin} from "../../common/model/plugins/plugin";
import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {SimpleProperty} from "xdean-util";
import {Wither} from "../../common/model/util";

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
                    if (this.board.selected.good.value !== "empty") {
                        this.sender.send(HSSLTopic.set, {card: this.board.selected.good.value});
                        this.board.selected.good.value = "empty";
                    }
                    break;
                case HSSLStatus.BuySwap:
                    break;
                case HSSLStatus.BanYun:
                    break;
                case HSSLStatus.DrawPlay:
                    break;
                case HSSLStatus.Over:
                    break;
            }
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
                        players[p.seat] = player.with({
                            boats: p.boats.map((v: any) => v === -1 ? "empty" : v),
                            handCount: p.hand[-1] || -1,
                            hand: new Array(6).fill(0).map((v, i) => p.hand[i] || 0),
                            items: new Array(3).fill(0).map((v, i) => p.items[i] || false),
                            points: p.points,
                        });
                    });
                });
                break;
            case HSSLTopic.status:
                this.board.status.value = data.status;
                this.board.current.value = data.current;
                break;
            case HSSLTopic.set            :
                this.board.goods.update(goods => {
                    goods[data.card]--;
                });
                this.board.players.update(players => {
                    players[data.seat].boats[data.round] = data.card;
                });
                break;
        }
    };
}

export type HSSLCard = "empty" | 0 | 1 | 2 | 3 | 4 | 5;
export const HSSLCards: HSSLCard[] = [0, 1, 2, 3, 4, 5];

export enum HSSLItem {
    GuanShui = 0,
    BanYun = 1,
    BiYue = 2,
    Boat = 3,
}

export const HSSLItems: HSSLItem[] = [3, 0, 1, 2];
export const HSSLSpecialItems: HSSLItem[] = [0, 1, 2];

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

export enum HSSLStatus {
    Set1 = 0,
    Set2,
    BuySwap,
    BanYun,
    DrawPlay,
    Over,
}

export class HSSLBoard {
    readonly status = new SimpleProperty<HSSLStatus>(HSSLStatus.Set1);
    readonly current = new SimpleProperty<number>(-1);
    readonly deck = new SimpleProperty<number>(66);
    readonly items = new SimpleProperty<number[]>(new Array(3).fill(2));
    readonly goods = new SimpleProperty<number[]>(new Array(6).fill(5));
    readonly board = new SimpleProperty<HSSLCard[]>(new Array(6).fill("empty"));
    readonly players = new SimpleProperty<HSSLPlayer[]>(new Array(4).fill(new HSSLPlayer()));

    readonly selected = {
        good: new SimpleProperty<HSSLCard>("empty"),
    };
}

export class HSSLPlayer extends Wither<HSSLPlayer> {
    readonly boats: HSSLCard[] = ["empty", "empty"];
    readonly handCount: number = 0;
    readonly hand: number[] = new Array(6).fill(0);
    readonly items: boolean[] = new Array(3).fill(false);
    readonly points: number = -1
}