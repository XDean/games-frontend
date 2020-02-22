import {LCCardColor} from "./model/card";

export const LCTheme = {
    cardBackground: cardBackground,
};

function cardBackground(color: LCCardColor | "unknown", type: "card" | "square") {
    switch (color) {
        case "unknown":
            return "#999";
        case 0:
            return "#faa";
        case 1:
            return "#fff";
        case 2:
            return "#0f0";
        case 3:
            return "#0ff";
        case 4:
            return "#ff0";
    }
}