import {HSSLCard, HSSLItem} from "./model/game";
import {CSSProperties} from "react";
import {Color} from "csstype";
import bg from "./resources/cards/bg.jpg"
import guanshui from "./resources/items/guanshui.jpg";
import boat from "./resources/items/boat.jpg";
import banyun from "./resources/items/banyun.jpg";
import biyue from "./resources/items/biyue.jpg";

export const HSSLTheme = {
    cardStyle: cardStyle,
    itemStyle: itemStyle,
};

export type HSSLCardStyle = {
    name: string
    color: {
        primary: Color
        secondary: Color
        font: Color
    }
    card: CSSProperties
}

function cardStyle(card: HSSLCard): HSSLCardStyle {
    switch (card) {
        case 0:
            return {
                name: "矿石",
                card: {
                    background: "#222",
                },
                color: {
                    primary: "#222",
                    secondary: "#000",
                    font: "#fff",
                },
            };
        case 1:
            return {
                name: "琉璃",
                card: {
                    background: "#f00",
                },
                color: {
                    primary: "#f00",
                    secondary: "#d00",
                    font: "#fff",
                },
            };
        case 2:
            return {
                name: "丝绸",
                card: {
                    background: "#f0f",
                },
                color: {
                    primary: "#f0f",
                    secondary: "#d0d",
                    font: "#fff",
                },
            };
        case 3:
            return {
                name: "瓷器",
                card: {
                    background: "#dee",
                },
                color: {
                    primary: "#dee",
                    secondary: "#bcc",
                    font: "#000",
                },
            };
        case 4:
            return {
                name: "香料",
                card: {
                    background: "#ff0",
                },
                color: {
                    primary: "#ff0",
                    secondary: "#aa0",
                    font: "#000",
                },
            };
        case 5:
            return {
                name: "茶叶",
                card: {
                    background: "#2d2",
                },
                color: {
                    primary: "#2d2",
                    secondary: "#282",
                    font: "#000",
                },
            };
        case "empty":
            return {
                name: "",
                card: {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                },
                color: {
                    primary: "#0000",
                    secondary: "#0000",
                    font: "#0000",
                },
            };
    }
}

export type HSSLItemStyle = {
    name: string
    card: CSSProperties
}

function itemStyle(item: HSSLItem): HSSLItemStyle {
    switch (item) {
        case HSSLItem.GuanShui:
            return {
                name: "通行证",
                card: {
                    backgroundImage: `url(${guanshui})`,
                },
            };
        case HSSLItem.BanYun:
            return {
                name: "搬运工",
                card: {
                    backgroundImage: `url(${banyun})`,
                },
            };
        case HSSLItem.BiYue:
            return {
                name: "交易所",
                card: {
                    backgroundImage: `url(${biyue})`,
                },
            };
        case HSSLItem.Boat:
            return {
                name: "货船",
                card: {
                    backgroundImage: `url(${boat})`,
                },
            };
    }
}