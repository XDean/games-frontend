import {HSSLCard, HSSLItem} from "./model/game";
import {Color} from "csstype";
import bg from "./resources/cards/bg.jpg"
import guanshui from "./resources/items/guanshui.jpg";
import boat from "./resources/items/boat.jpg";
import banyun from "./resources/items/banyun.jpg";
import biyue from "./resources/items/biyue.jpg";
import {createMuiTheme} from "@material-ui/core";
import card0 from "./resources/cards/card0.jpg"
import card1 from "./resources/cards/card1.jpg"
import card2 from "./resources/cards/card2.jpg"
import card3 from "./resources/cards/card3.jpg"
import card4 from "./resources/cards/card4.jpg"
import card5 from "./resources/cards/card5.jpg"


export const HSSLTheme = {
    cardStyle: cardStyle,
    itemStyle: itemStyle,
    selectedBox: {
        boxShadow: "0 0px 3px 4px #7af",
    },
    ...createMuiTheme({})
};

export type HSSLCardStyle = {
    name: string
    color: {
        primary: Color
        secondary: Color
        font: Color
    }
    image: string,
}

function cardStyle(card: HSSLCard): HSSLCardStyle {
    switch (card) {
        case 0:
            return {
                name: "矿石",
                image: card0,
                color: {
                    primary: "#24272e",
                    secondary: "#84878e",
                    font: "#fff",
                },
            };
        case 1:
            return {
                name: "琉璃",
                image: card1,
                color: {
                    primary: "#dd3f40",
                    secondary: "#fd5f60",
                    font: "#fff",
                },
            };
        case 2:
            return {
                name: "丝绸",
                image: card2,
                color: {
                    primary: "#c669c2",
                    secondary: "#e689e2",
                    font: "#fff",
                },
            };
        case 3:
            return {
                name: "瓷器",
                image: card3,
                color: {
                    primary: "#e5eef3",
                    secondary: "#c7d2d4",
                    font: "#000",
                },
            };
        case 4:
            return {
                name: "香料",
                image: card4,
                color: {
                    primary: "#ebd356",
                    secondary: "#dba306",
                    font: "#000",
                },
            };
        case 5:
            return {
                name: "茶叶",
                image: card5,
                color: {
                    primary: "#68d576",
                    secondary: "#508c68",
                    font: "#000",
                },
            };
        case -1:
            return {
                name: "",
                image: bg,
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
    image: string
}

function itemStyle(item: HSSLItem): HSSLItemStyle {
    switch (item) {
        case HSSLItem.GuanShui:
            return {
                name: "通行证",
                image: guanshui,
            };
        case HSSLItem.BanYun:
            return {
                name: "搬运工",
                image: banyun,
            };
        case HSSLItem.BiYue:
            return {
                name: "交易所",
                image: biyue,
            };
        case HSSLItem.Boat:
            return {
                name: "货船",
                image: boat,
            };
    }
}