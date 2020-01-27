import {LCGame} from "../model/model";

export function connectLC(id: number): LCGame {
    let res = new LCGame(0);

    let ws = relWebsocket("socket/game/lostcities/" + id);

    ws.onopen = e => {
        console.debug(e);
    };
    ws.onmessage = e => {
        console.debug(e);
    };
    ws.onclose = e => {
        console.debug(e);
    };

    return res;
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