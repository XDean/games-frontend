import {LCCard, LCCardColor, LCCards} from "./card"
import {MultiPlayerBoard} from "../../common/model/multi-player";
import {LCPlayerScore} from "./score";
import {ChatController} from "../../common/model/chat";
import {SimpleProperty} from "xdean-util";
import {EmptyTopicSender, SocketInit, SocketTopicHandler, SocketTopicSender} from "../../common/model/socket";
import React from "react";

export type PlayType = "none" | "play" | "drop"
export type DrawType = "none" | "deck" | LCCardColor

export class LCGame implements SocketTopicHandler, SocketInit {
    readonly host: MultiPlayerBoard;
    readonly board: LCBoard = new LCBoard();
    readonly plugins = {
        chat: new ChatController()
    };
    readonly playInfo = {
        card: new SimpleProperty<LCCard | "none">("none"),
        playType: new SimpleProperty<PlayType>("none"),
        drawType: new SimpleProperty<DrawType>("none"),
        canSubmit: () => {
            let isMyTurn = this.host.mySeat.value === this.board.current.value;
            return isMyTurn &&
                this.playInfo.card.value !== "none" &&
                this.playInfo.playType.value !== "none" &&
                this.playInfo.drawType.value !== "none";
        },
        submit: () => {
            this.sender.send("play", {
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
        this.host = new MultiPlayerBoard(myId);
        this.host.setPlayerCount(2);
    }

    init = (sender: SocketTopicSender) => {
        this.sender = sender;
        this.host.init(sender);
        Object.values(this.plugins).forEach(p => {
            p.init(sender);
        });
    };

    handle = (topic: string, data: any): void => {
        this.host.handle(topic, data);
        Object.values(this.plugins).forEach(p => {
            p.handle(topic, data)
        });
        switch (topic) {
            case "host-info":
                if (data.playing) {
                    this.sender.send("game-info");
                }
                break;
            case "game-info":
            case "game-start":
                this.board.over.value = data.over;
                this.board.current.value = data.current;
                this.board.deck.value = data.deck;
                this.board.board.value = data.board.map((a: any) => a.map((b: any) => b.map((c: any) => new LCCard(c))));
                this.board.drop.value = data.drop.map((a: any) => a.map((b: any) => new LCCard(b)));
                this.board.hand.value = data.hand.map((a: any) => a.map((b: any) => new LCCard(b)));
                break;
            case "play":
                let card = new LCCard(data.card);
                this.board.hand.update(hs => {
                    let hand = hs[data.seat];
                    let index = hand.findIndex(c => c.int === card.int);
                    if (index !== -1) {
                        hand.splice(index, 1)
                    }
                });
                if (data.drop) {
                    this.board.drop.update(ds => {
                        ds[card.color].push(card);
                    });
                } else {
                    this.board.board.update(ds => {
                        ds[data.seat][card.color].push(card);
                    });
                }
                if (data.deck) {
                    this.board.deck.update(d => d - 1);
                } else {
                    let dropColor = data["draw-drop"] as LCCardColor;
                    this.board.drop.update(ds => {
                        ds[dropColor].slice(ds[dropColor].length - 1, 1);
                    });
                    this.board.hand.update(hs=>{
                        hs[data.seat].push(new LCCard(data["draw-drop-card"]))
                    });
                }
                break;
            case "draw":
                this.board.hand.update(hs=>{
                    hs[data.seat].push(new LCCard(data.card))
                });
                break;
            case "turn":
                this.board.current.value = data;
                break;
        }
    };
}

export type LCCardBoard = LCCards[]

export const EmptyDrop = [[], [], [], [], []];
export const EmptyBoard = [EmptyDrop, EmptyDrop];
export const EmptyHand = [[], []];

export class LCBoard {
    readonly over = new SimpleProperty<boolean>(false);
    readonly current = new SimpleProperty<number>(0);
    readonly deck = new SimpleProperty<number>(0);
    readonly drop = new SimpleProperty<LCCardBoard>(EmptyDrop);
    readonly board = new SimpleProperty<LCCardBoard[]>(EmptyBoard);
    readonly hand = new SimpleProperty<LCCards[]>(EmptyHand);

    calcScore = (): LCPlayerScore[] => {
        return this.board.value.map(b => new LCPlayerScore(b))
    };
}