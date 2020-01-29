import {LCCard, LCGame, LCPlayer} from "../model/model";
import global from "../../global"
import {SimpleProperty} from "xdean-util";

type LCConnection = {
    game: LCGame,
    ws: WebSocket,
    close: () => void,
}

const games = new Map<string, LCConnection>();

export function connectLC(id: string): LCGame {
    let saved = games.get(id);
    if (saved) {
        return saved.game;
    }
    let game = new LCGame();
    game.gameId.value = id;

    let closed = false;
    let ws = createWS();

    function createWS() {
        let res = relWebsocket(`socket/game/lostcities/${id}?user=${global.id}`);

        res.onopen = e => {
            console.debug(e);
        };
        res.onmessage = e => {
            let event = JSON.parse(e.data);
            let data = event.payload;
            console.debug("OnMessage", event);

            switch (event.topic) {
                case "host-info":
                    data.players.forEach((p: any) => {
                        if (p) {
                            if (p.id === global.id) {
                                game.mySeat.value = p.seat;
                            } else {
                                game.player.value = new LCPlayer(p.id, p.seat, p.connected, p.ready);
                            }
                        }
                    });
                    game.addMessage("您加入了游戏： " + data.id);
                    break;
                case "join":
                    if (data.seat === 1 - game.mySeat.value) {
                        game.player.value = new LCPlayer(data.id, data.seat, data.connected, data.ready);
                        game.addMessage("玩家加入： " + data.id);
                    }
                    break;
                case "game-info":
                    game.currentSeat.value = data["current-seat"];
                    game.deck.value = data.deck;
                    game.myHand.value = data.hand.map((v: number) => new LCCard(v));

                    let updateBoard = function (key: string, board: SimpleProperty<LCCard[][]>) {
                        let res = LCGame.emptyBoard();
                        data[key].forEach((colors: any[], index: number) => {
                            res[index] = colors.map(card => new LCCard(card));
                        });
                        board.value = res;
                    };
                    updateBoard("my-board", game.myBoard);
                    updateBoard("other-board", game.otherBoard);
                    updateBoard("drop-board", game.dropBoard);
                    break;
                case "turn":
                    game.currentSeat.value = data;
                    break;
                case "play":
                    game.myHand.update(hand => {
                        let index = hand.indexOf(data.card);
                        return hand.slice().splice(index, 1)
                    });
                    if (data.drop) {
                    }
            }
        };
        res.onclose = e => {
            console.debug(e);
            if (!closed) {
                games.get(id)!.ws = createWS()
            }
        };
        res.onerror = e => {
            closed = true;
        };
        return res;
    }

    games.set(id, {
        game: game,
        ws: ws,
        close: () => {
            closed = true;
            ws.close();
        }
    });
    return game;
}

export function playLC(game: LCGame, card: LCCard, op: "play" | "drop", draw: "deck" | number) {
    let ws = games.get(game.gameId.value)!.ws;
    ws.send(JSON.stringify({
        topic: "play",
        payload: {
            card: card.int,
            drop: op === "drop",
            deck: draw === "deck",
            color: (draw === "deck") ? undefined : draw,
        },
    }));
}

function relWebsocket(rel: string): WebSocket {
    let url = window.location.href.replace(window.location.hash, "");
    if (process.env.NODE_ENV === 'development') {
        url = "http://localhost:11071/"
    }
    if (url.startsWith("http://")) {
        url = "ws://" + url.substring(7);
    }
    if (url.startsWith("https://")) {
        url = "wss://" + url.substring(8);
    }
    return new WebSocket(resolveUrl(url, rel));
}

export function resolveUrl(base: string, rel: string) {
    if (base.endsWith('/')) {
        return base + rel;
    } else {
        return base.substring(0, base.lastIndexOf('/') + 1) + rel;
    }
}
