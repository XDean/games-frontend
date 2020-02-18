import {LCCardColor} from "../model/card";

export function cardColor(color: LCCardColor) {
    switch (color) {
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