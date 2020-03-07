import React from 'react';
import {HSSLCard} from "../model/game";
import CubeView from "../../common/component/cube";

type HSSLCubeProp = {
    card: HSSLCard
}

const HSSLCubeView: React.FunctionComponent<HSSLCubeProp> = (props) => {
    let color, borderColor;
    switch (props.card) {
        case 0:
            color = "#222";
            borderColor = "#000";
            break;
        case 1:
            color = "#ff0";
            borderColor = "#aa0";
            break;
        case 2:
            color = "#2d2";
            borderColor = "#282";
            break;
        case 3:
            color = "#dee";
            borderColor = "#bcc";
            break;
        case 4:
            color = "#f00";
            borderColor = "#c00";
            break;
        case 5:
            color = "#f0f";
            borderColor = "#c0c";
            break;
        case "empty":
            return null;
    }
    return (
        <CubeView size={20} color={color} borderColor={borderColor}/>
    )
};

export default HSSLCubeView;