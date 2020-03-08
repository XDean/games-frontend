import React from 'react';
import {HSSLCard} from "../model/game";
import CubeView from "../../common/component/cube";
import {HSSLTheme} from "../theme";

type HSSLCubeProp = {
    card: HSSLCard
}

const HSSLCubeView: React.FunctionComponent<HSSLCubeProp> = (props) => {
    const style = HSSLTheme.cardStyle(props.card);
    if (props.card === "empty") {
        return null;
    } else {
        return (
            <CubeView size={20} color={style.color.primary} borderColor={style.color.secondary}/>
        )
    }
};

export default HSSLCubeView;