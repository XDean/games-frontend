import {Wither} from "../util";
import {SimpleProperty} from "xdean-util";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../socket";
import {LogPlugin} from "../plugins/log";
import {HostMessage, JoinMessage, MultiPlayerMessage, ReadyMessage, SwapSeatMessage, WatchMessage} from "./message";

export type MultiPlayerRole = "none" | "not-determined" | "play" | "watch";

export class MultiPlayerBoard implements SocketTopicHandler, SocketInit {
    readonly myRole = new SimpleProperty<MultiPlayerRole>("none");
    readonly mySeat = new SimpleProperty<number>(0);
    readonly playing = new SimpleProperty<boolean>(false);
    readonly playerCount = new SimpleProperty<number>(0);
    readonly players = new SimpleProperty<MultiGamePlayer[]>([]);
    readonly watchers = new SimpleProperty<MultiGameWatcher[]>([]);

    private sender: SocketTopicSender = EmptyTopicSender;
    private connected: string[] = [];

    constructor(
        readonly myId: string,
        readonly log: LogPlugin<MultiPlayerMessage>,
    ) {
    }

    setPlayerCount = (count: number) => {
        this.playerCount.value = count;
        this.players.value = new Array(count).fill(0).map(e => MultiGamePlayer.EMPTY);
    };

    isFull = () => {
        return this.players.value.every(p => !p.isEmpty());
    };

    isAllReady = () => {
        return this.players.value.every(p => p.isEmpty() || p.ready);
    };

    getPlayerCount = () => {
        return this.players.value.filter(p => !p.isEmpty()).length;
    };

    joinGame = () => {
        this.sender.send("join");
    };

    watchGame = () => {
        this.sender.send("watch")
    };

    swapSeat = (targetSeat: number) => {
        this.sender.send("swap-seat", {target: targetSeat});
    };

    ready = (ready: boolean = true) => {
        this.sender.send("ready", ready);
    };

    startGame = () => {
        this.sender.send("game-start", true);
    };

    init = (sender: SocketTopicSender) => {
        sender.send("connect-info");
        sender.send("room-info");
        this.sender = sender;
    };

    handle = (topic: string, data: any): void => {
        switch (topic) {
            case "connect-info":
                this.connected = data;
                break;
            case "connect":
                this.updateConnected(data, true);
                break;
            case "disconnect":
                this.updateConnected(data, false);
                break;
            case "room-info":
                this.playing.value = data.playing;
                if (data.playing) {
                    this.log.log(HostMessage.CONTINUE)
                }
                this.players.value = data.players.map((p: any) => p === null ? MultiGamePlayer.EMPTY :
                    new MultiGamePlayer(p.id, p.seat, p.ready, this.connected.indexOf(p.id) !== -1, p.host));
                this.watchers.value = data.watchers.map((p: any) => new MultiGameWatcher(p.id, this.connected.indexOf(p.id) !== -1));
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
                    ps[data.seat] = new MultiGamePlayer(data.id, data.seat, data.ready, true, data.host);
                });
                this.log.log(new JoinMessage(data.id));
                break;
            case "watch":
                if (data.id === this.myId) {
                    this.myRole.value = "watch";
                    this.mySeat.value = 0;
                }
                this.watchers.update(ws => {
                    ws.push(new MultiGameWatcher(data.id, true));
                });
                this.log.log(new WatchMessage(data.id));
                break;
            case "ready":
                this.players.update(ps => {
                    ps[data.seat] = ps[data.seat].with({ready: data.ready})
                });
                this.log.log(new ReadyMessage(data.id, data.ready));
                break;
            case "game-start":
                this.playing.value = true;
                this.log.log(HostMessage.START);
                break;
            case "game-over":
                this.playing.value = false;
                this.players.update(ps => ps.map(p => p.with({ready: false})));
                this.log.log(HostMessage.OVER);
                break;
            case "swap-seat":
                this.players.update(ps => {
                    this.log.log(new SwapSeatMessage(ps[data.from], ps[data.target]));
                    let p = ps[data.from];
                    ps[data.from] = ps[data.target];
                    ps[data.target] = p;
                });
                if (data.from === this.mySeat.value) {
                    this.mySeat.value = data.target;
                } else if (data.target === this.mySeat.value) {
                    this.mySeat.value = data.from;
                }
        }
    };

    private updateConnected = (id: string, connect: boolean) => {
        let player = this.players.value.find(p => p && p.id === id);
        if (player) {
            let index = this.players.value.indexOf(player);
            this.players.update(ps => {
                ps[index] = ps[index].with({connected: connect})
            })
        }
        let watcher = this.watchers.value.find(p => p.id === id);
        if (watcher) {
            let index = this.watchers.value.indexOf(watcher);
            this.watchers.update(ps => {
                ps[index] = ps[index].with({connected: connect})
            })
        }
    }
}

export class MultiGamePlayer extends Wither<MultiGamePlayer> {
    static EMPTY = new MultiGamePlayer("", -1, false);

    readonly connected: boolean;
    readonly host: boolean;

    constructor(
        readonly id: string,
        readonly seat: number,
        readonly ready: boolean,
        connected?: boolean,
        host?: boolean,
    ) {
        super();
        this.host = host || false;
        this.connected = connected || false;
    }

    isEmpty = (): boolean => {
        return this.id === "";
    };
}

export class MultiGameWatcher extends Wither<MultiGameWatcher> {

    readonly connected: boolean;

    constructor(
        readonly id: string = "",
        connected?: boolean,
    ) {
        super();
        this.connected = connected || false;
    }
}