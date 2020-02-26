import {LCCardColor} from "./model/card";
import cardBgImg from "./resources/card-background.webp"
import card0 from "./resources/card-0.webp"
import card1 from "./resources/card-1.webp"
import card2 from "./resources/card-2.webp"
import card3 from "./resources/card-3.webp"
import card4 from "./resources/card-4.webp"

export const LCTheme = {
    cardBackground: cardBackground,
    selectedShadow: "0 0 10px #4a4",
};

function cardBackground(color: LCCardColor | "unknown", type: "card" | "square") {
    switch (color) {
        case "unknown":
            return `url(${cardBgImg})`;
        case 0:
            return `url(${card0})`;
        case 1:
            return `url(${card1})`;
        case 2:
            return `url(${card2})`;
        case 3:
            return `url(${card3})`;
        case 4:
            return `url(${card4})`;
    }
}