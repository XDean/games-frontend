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
    cube: {
        color: Color
        borderColor: Color
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
                cube: {
                    color: "#222",
                    borderColor: "#000",
                },
            };
        case 1:
            return {
                name: "香料",
                card: {
                    background: "#ff0",
                },
                cube: {
                    color: "#ff0",
                    borderColor: "#aa0",
                },
            };
        case 2:
            return {
                name: "茶叶",
                card: {
                    background: "#2d2",
                },
                cube: {
                    color: "#2d2",
                    borderColor: "#282",
                },
            };
        case 3:
            return {
                name: "瓷器",
                card: {
                    background: "#dee",
                },
                cube: {
                    color: "#dee",
                    borderColor: "#bcc",
                },
            };
        case 4:
            return {
                name: "琉璃",
                card: {
                    background: "#f00",
                },
                cube: {
                    color: "#f00",
                    borderColor: "#d00",
                },
            };
        case 5:
            return {
                name: "丝绸",
                card: {
                    background: "#f0f",
                },
                cube: {
                    color: "#f0f",
                    borderColor: "#d0d",
                },
            };
        case "empty":
            return {
                name: "",
                card: {
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "cover",
                },
                cube: {
                    color: "#0000",
                    borderColor: "#0000",
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