import {LCCard, LCGame, LCPlayer} from "../model/model";
import global from "../../global"
import {SimpleProperty} from "xdean-util";

const games = new Map<string, [LCGame, WebSocket]>();

export function connectLC(id: string): LCGame {
    let saved = games.get(id);
    if (saved) {
        return saved[0];
    }
    let game = new LCGame();
    game.gameId.value = id;

    let ws = relWebsocket(`socket/game/lostcities/${id}?user=${global.id}`);

    ws.onopen = e => {
        console.debug(e);
    };
    ws.onmessage = e => {
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
                game.myHand.value = data.hand.map((v: number) => intToCard(v));

                let updateBoard = function (key: string, board: SimpleProperty<LCCard[][]>) {
                    let res = LCGame.emptyBoard();
                    data[key].forEach((colors: any[], index: number) => {
                        res[index] = colors.map(card => intToCard(card));
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
        }
    };
    ws.onclose = e => {
        console.debug(e);
    };
    games.set(id, [game, ws]);
    return game;
}

export function playLC(game: LCGame, card: LCCard, op: "play" | "drop", draw: "deck" | number) {

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

function intToCard(v: number): LCCard {
    if (v < 0) {
        return new LCCard("unknown")
    }
    let point = v % 12;
    return new LCCard(Math.floor(v / 12), point < 3 ? "double" : point - 1);
}
