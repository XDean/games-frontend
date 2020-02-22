import {Wither} from "./util";
import {SimpleProperty} from "xdean-util";
import {SocketInit, SocketTopicHandler, SocketTopicSender} from "./socket";

export class MultiPlayerBoard implements SocketTopicHandler, SocketInit {
    readonly myRole = new SimpleProperty<"none" | "play" | "watch">("none");
    readonly mySeat = new SimpleProperty<number>(0);
    readonly playerCount = new SimpleProperty<number>(0);
    readonly players = new SimpleProperty<MultiGamePlayer[]>([]);
    readonly watchers = new SimpleProperty<MultiGameWatcher[]>([]);

    setPlayerCount = (count: number) => {
        this.playerCount.value = count;
        this.players.value = new Array(count);
    };

    handle = (topic: string, data: any): void => {
    };

    init = (sender: SocketTopicSender) => {

    };
}

export class MultiGamePlayer extends Wither<MultiGamePlayer> {
    static EMPTY = new MultiGamePlayer();

    readonly id: string = "";
    readonly seat: number = 0;
    readonly connected: boolean = false;
    readonly ready: boolean = false;

    isEmpty = (): boolean => {
        return this.id === "";
    };
}

export class MultiGameWatcher extends Wither<MultiGameWatcher> {
    readonly id: string = "";
    readonly connected: boolean = false;
}