export type WSHandle = {
    send(data: string): void,
    close(): void,
}

export function autoWs(config: {
    rel: string,
    oninit?: (ws: WebSocket, ev: Event) => void,
    onretry?: (ws: WebSocket) => void,
    onopen?: (ws: WebSocket, ev: Event) => void,
    onmessage?: (ws: WebSocket, ev: MessageEvent) => void,
    onerror?: (ws: WebSocket, ev: Event) => void,
    onclose?: (ws: WebSocket, ev: CloseEvent) => void,
}): WSHandle {
    let init = false;
    let closed = false;
    let currentWs = createWs();

    function createWs(): WebSocket {
        let ws = relWebsocket(config.rel);
        ws.onopen = (e) => {
            console.trace("Websocket on open: " + e);
            if (!init) {
                init = true;
                console.trace("Websocket init");
                config.oninit && config.oninit(ws, e);
            }
            config.onopen && config.onopen(ws, e);
        };
        ws.onmessage = (e) => {
            console.trace("Websocket on message: " + e);
            config.onmessage && config.onmessage(ws, e);
        };
        ws.onerror = (e) => {
            console.trace("Websocket on error: " + e);
            config.onerror && config.onerror(ws, e);
            closed = true;
        };
        ws.onclose = (e) => {
            console.trace("Websocket on close: " + e);
            if (closed) {
                config.onclose && config.onclose(ws, e);
            } else {
                console.trace("Websocket on close: " + e);
                config.onretry && config.onretry(ws);
                currentWs = createWs();
            }
        };
        return ws;
    }

    return {
        send(data: string) {
            currentWs.send(data)
        },
        close() {
            closed = true;
            currentWs.close();
        }
    }
}

export function relWebsocket(rel: string): WebSocket {
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
