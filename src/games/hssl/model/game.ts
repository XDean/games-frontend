import {MultiPlayerBoard} from "../../common/model/multi-player/host";
import {ChatPlugin} from "../../common/model/plugins/chat";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../../common/model/socket";
import {LogPlugin} from "../../common/model/plugins/log";
import {SocketPlugin} from "../../common/model/plugins/plugin";
import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {SimpleProperty} from "xdean-util";

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
                this.sender.send("hssl-info");
                break;
            case "hssl-info":
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
                data.players.forEach((p: any) => {
                    let player = this.board.players[p.seat];
                    player.boats.value = p.boats;
                    player.hand.update(hand => hand.map((v, index) => p.hand[index] || 0));
                    if (p.hand[-1]) {
                        player.handCount.value = p.hand[-1];
                    }
                    player.items.update(items => items.map((v, index) => p.items[index] || false));
                    player.points.value = p.points;
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
    readonly players: HSSLPlayer[] = new Array(4).fill(new HSSLPlayer());
}

export class HSSLPlayer {
    readonly boats = new SimpleProperty<number[]>([-1, -1]);
    readonly handCount = new SimpleProperty<number>(3);
    readonly hand = new SimpleProperty<number[]>([]);
    readonly items = new SimpleProperty<boolean[]>(new Array(3).fill(false));
    readonly points = new SimpleProperty<number>(0)
}