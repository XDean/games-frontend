import {Wither} from "../util";
import {SimpleProperty} from "xdean-util";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../socket";
import {LogPlugin} from "../log";
import {JoinMessage, MultiPlayerMessage, OverMessage, ReadyMessage, StartMessage, WatchMessage} from "./message";

export type MultiPlayerRole = "none" | "not-determined" | "play" | "watch";

export class MultiPlayerBoard implements SocketTopicHandler, SocketInit {
    readonly myRole = new SimpleProperty<MultiPlayerRole>("none");
    readonly mySeat = new SimpleProperty<number>(0);
    readonly playing = new SimpleProperty<boolean>(false);
    readonly playerCount = new SimpleProperty<number>(0);
    readonly players = new SimpleProperty<MultiGamePlayer[]>([]);
    readonly watchers = new SimpleProperty<MultiGameWatcher[]>([]);

    private sender: SocketTopicSender = EmptyTopicSender;

    constructor(
        readonly myId: string,
        readonly log: LogPlugin<MultiPlayerMessage>,
    ) {
    }

    setPlayerCount = (count: number) => {
        this.playerCount.value = count;
        this.players.value = new Array(count).map(e => MultiGamePlayer.EMPTY);
    };

    isFull = () => {
        return this.players.value.every(p => !p.isEmpty());
    };

    joinGame = () => {
        this.sender.send("join");
        this.sender.send("ready", true);
    };

    watchGame = () => {
        this.sender.send("watch")
    };

    init = (sender: SocketTopicSender) => {
        sender.send("host-info");
        this.sender = sender;
    };

    handle = (topic: string, data: any): void => {
        switch (topic) {
            case "host-info":
                this.playing.value = data.playing;
                this.players.value = data.players.map((p: any) => p === null ? MultiGamePlayer.EMPTY : new MultiGamePlayer(p.id, p.seat, p.ready));
                this.watchers.value = data.watchers.map((p: any) => new MultiGameWatcher(p.id));
                let find = false;
                this.players.value.forEach(p => {
                    if (p.id === this.myId) {
                        this.myRole.value = "play";
                        this.mySeat.value = p.seat;
                        find = true
                    }
                });
                if (!find) {
                    this.watchers.value.forEach(p => {
                        if (p.id === this.myId) {
                            this.myRole.value = "watch";
                            find = true
                        }
                    });
                }
                if (!find) {
                    this.myRole.value = "not-determined"
                }
                break;
            case "join":
                if (data.id === this.myId) {
                    this.myRole.value = "play";
                    this.mySeat.value = data.seat;
                }
                this.players.update(ps => {
                    ps[data.seat] = new MultiGamePlayer(data.id, data.seat, data.ready);
                });
                this.log.log(new JoinMessage(data.id));
                break;
            case "watch":
                if (data.id === this.myId) {
                    this.myRole.value = "watch";
                    this.mySeat.value = 0;
                }
                this.watchers.update(ws => {
                    ws.push(new MultiGameWatcher(data.id));
                });
                this.log.log(new WatchMessage(data.id));
                break;
            case "ready":
                this.players.update(ps => {
                    ps[data.seat] = ps[data.seat].with({ready: data.ready})
                });
                this.log.log(new ReadyMessage(data.id, true));
                break;
            case "game-start":
                this.playing.value = true;
                this.log.log(new StartMessage());
                break;
            case "over":
                this.playing.value = false;
                this.log.log(new OverMessage());
                break;
        }
    };
}

export class MultiGamePlayer extends Wither<MultiGamePlayer> {
    static EMPTY = new MultiGamePlayer("", -1, false);

    constructor(
        readonly id: string,
        readonly seat: number,
        readonly ready: boolean,
    ) {
        super();
    }

    isEmpty = (): boolean => {
        return this.id === "";
    };
}

export class MultiGameWatcher extends Wither<MultiGameWatcher> {
    constructor(
        readonly id: string = ""
    ) {
        super();
    }
}