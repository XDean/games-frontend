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
        }
    };
}

export type HSSLCard = "empty" | 0 | 1 | 2 | 3 | 4 | 5

export enum HSSLItem {
    Boat = 0,
    GuanShui = 1,
    BanYun = 2,
    BiYue = 3
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
    readonly deck = new SimpleProperty<number>(0);
    readonly items = new SimpleProperty<number[]>(new Array(3).fill(2));
    readonly goods = new SimpleProperty<number[]>(new Array(6).fill(5));
    readonly board = new SimpleProperty<HSSLCard[]>(new Array(6).fill("empty"));
    readonly players = new Array(4).fill(new HSSLPlayer());
}

export class HSSLPlayer {
    readonly boats = new SimpleProperty<number[]>([-1, -1]);
    readonly hand = new SimpleProperty<number[]>([]);
    readonly items = new SimpleProperty<number[]>(new Array(3).fill(0));
    readonly points = new SimpleProperty<number>(0)
}