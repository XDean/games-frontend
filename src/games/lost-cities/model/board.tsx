import {LCCard, LCCardColor, LCCards} from "./card"
import {MultiPlayerBoard} from "../../common/model/multi-player/host";
import {LCPlayerScore} from "./score";
import {ChatPlugin} from "../../common/model/plugins/chat";
import {SimpleProperty} from "xdean-util";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../../common/model/socket";
import React from "react";
import {LogPlugin} from "../../common/model/plugins/log";
import {SocketPlugin} from "../../common/model/plugins/plugin";
import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {LCDrawMessage, LCGameMessage, LCPlayMessage, LCScoreMessage} from "./message";
import MultiPlayerTopics from "../../common/model/multi-player/topic";

const LCTopic = {
    Info: "lostcities-info",
    Play: "lostcities-play",
    Turn: "lostcities-turn",
};

export type LCPlayType = "none" | "play" | "drop"
export type LCDrawType = "none" | "deck" | LCCardColor
export type LCMessage = MultiPlayerMessage | LCGameMessage | LCScoreMessage

export class LCGame implements SocketTopicHandler, SocketInit {

    private log = new LogPlugin<LCMessage>();
    private chat = new ChatPlugin();

    readonly host: MultiPlayerBoard;
    readonly board: LCBoard = new LCBoard();

    readonly plugins = {
        log: this.log,
        chat: this.chat,
    };

    readonly playInfo = {
        card: new SimpleProperty<LCCard | "none">("none"),
        playType: new SimpleProperty<LCPlayType>("none"),
        drawType: new SimpleProperty<LCDrawType>("none"),
        validate: () => {
            let playCard = this.playInfo.card.value;
            let playType = this.playInfo.playType.value;
            let drawType = this.playInfo.drawType.value;
            if (playCard !== "none" && playType === "drop" && playCard.color === drawType) {
                return "你不可以摸起即将打出的牌";
            }
            if (drawType !== "none" && drawType !== "deck" && this.board.drop.value[drawType].length === 0) {
                return "弃牌堆中没有可用的牌";
            }
            if (playCard !== "none" && playType === "play") {
                let playCards = this.board.board.value[this.host.mySeat.value][playCard.color];
                if (playCards.length > 0 && playCard.point < playCards[playCards.length - 1].point) {
                    return "同一系列点数必须递增";
                }
            }
            return "";
        },
        submit: () => {
            this.sender.send(LCTopic.Play, {
                card: (this.playInfo.card.value as LCCard).int,
                drop: this.playInfo.playType.value === "drop",
                deck: this.playInfo.drawType.value === "deck",
                "draw-color": (this.playInfo.drawType.value === "deck") ? undefined : this.playInfo.drawType.value,
            });
            this.playInfo.card.value = "none";
            this.playInfo.playType.value = "none";
            this.playInfo.drawType.value = "none";
        }
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
            case MultiPlayerTopics.Info:
                this.sender.send(LCTopic.Info);
                break;
            case LCTopic.Info:
                this.board.over.value = data.over;
                this.board.current.value = data.current;
                this.board.deck.value = data.deck;
                this.board.board.value = data.board.map((a: any) => a.map((b: any) => b.map((c: any) => new LCCard(c))));
                this.board.drop.value = data.drop.map((a: any) => a.map((b: any) => new LCCard(b)));
                this.board.hand.value = data.hand.map((a: any) => a.map((b: any) => new LCCard(b)));
                break;
            case LCTopic.Play:
                let card = new LCCard(data.card);
                let removePlayedCard = (hs: LCCards[]) => {
                    let hand = hs[data.seat];
                    let index = hand.findIndex(c => c.int === card.int);
                    if (index !== -1) {
                        hand.splice(index, 1)
                    }
                };
                if (data.drop) {
                    this.board.drop.update(ds => {
                        ds[card.color].push(card);
                    });
                } else {
                    this.board.board.update(ds => {
                        ds[data.seat][card.color].push(card);
                    });
                }
                this.log.log(new LCPlayMessage(data.seat, card, data.drop));
                if (data.deck) {
                    this.board.deck.update(d => d - 1);
                    if (data["deck-card"] !== -1) {
                        let deckCard = new LCCard(data["deck-card"]);
                        this.board.hand.update(hs => {
                            removePlayedCard(hs);
                            hs[data.seat].push(deckCard)
                        });
                        this.log.log(new LCDrawMessage(data.seat, "deck", deckCard))
                    } else {
                        this.log.log(new LCDrawMessage(data.seat, "deck"))
                    }
                } else {
                    let dropColor = data["draw-color"] as LCCardColor;
                    let dropCard = new LCCard(data["draw-drop-card"]);
                    this.board.drop.update(ds => {
                        ds[dropColor].splice(ds[dropColor].length - 1, 1);
                    });
                    this.board.hand.update(hs => {
                        removePlayedCard(hs);
                        hs[data.seat].push(dropCard)
                    });
                    this.log.log(new LCDrawMessage(data.seat, dropColor, dropCard))
                }
                break;
            case LCTopic.Turn:
                this.board.current.value = data;
                break;
            case MultiPlayerTopics.Over:
                this.board.over.value = true;
                this.log.log(new LCScoreMessage(this.host.players.value, this.board.calcScore()));
                break;
        }
    };
}

export type LCCardBoard = LCCards[]

export class LCBoard {
    readonly over = new SimpleProperty<boolean>(false);
    readonly current = new SimpleProperty<number>(0);
    readonly deck = new SimpleProperty<number>(44);
    readonly drop = new SimpleProperty<LCCardBoard>(new Array(5).fill([]));
    readonly board = new SimpleProperty<LCCardBoard[]>(new Array(2).fill(new Array(5).fill([])));
    readonly hand = new SimpleProperty<LCCards[]>(new Array(2).fill([]));

    calcScore = (): LCPlayerScore[] => {
        return this.board.value.map(b => new LCPlayerScore(b))
    };
}