export type WSHandle = {
    send(data: string): void,
    close(): void,
}

export type WSConfig = {
    rel: string,
    oninit?: (ev: Event) => void,
    onretry?: () => void,
    onopen?: (ev: Event) => void,
    onmessage?: (ev: MessageEvent) => void,
    onerror?: (ev: Event) => void,
    onclose?: (ev: CloseEvent) => void,
}

export function autoWs(config: WSConfig): WSHandle {
    let init = false;
    let closed = false;
    let currentWs = createWs();

    function createWs(): WebSocket {
        let ws = relWebsocket(config.rel);
        ws.onopen = (e) => {
            console.debug("Websocket on open", e);
            if (!init) {
                init = true;
                console.debug("Websocket init");
                config.oninit && config.oninit(e);
            }
            config.onopen && config.onopen(e);
        };
        ws.onmessage = (e) => {
            console.debug("Websocket on message", e);
            config.onmessage && config.onmessage(e);
        };
        ws.onerror = (e) => {
            console.debug("Websocket on error", e);
            config.onerror && config.onerror(e);
            closed = true;
        };
        ws.onclose = (e) => {
            console.debug("Websocket on close", e);
            if (closed) {
                config.onclose && config.onclose(e);
            } else {
                console.debug("Websocket on close", e);
                config.onretry && config.onretry();
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
            if (!closed) {
                closed = true;
                currentWs.close();
            }
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
