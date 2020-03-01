import {MultiPlayerBoard} from "../../common/model/multi-player/host";
import {ChatPlugin} from "../../common/model/plugins/chat";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../../common/model/socket";
import {LogPlugin} from "../../common/model/plugins/log";
import {SocketPlugin} from "../../common/model/plugins/plugin";
import {MultiPlayerMessage} from "../../common/model/multi-player/message";

export class HSSLGame implements SocketTopicHandler, SocketInit {

    private log = new LogPlugin<any>();
    private chat = new ChatPlugin();

    readonly host: MultiPlayerBoard;

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
        this.host.setPlayerCount(2);
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