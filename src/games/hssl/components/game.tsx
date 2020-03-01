import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import {HSSLGame} from "../model/game";

const useStyles = makeStyles({});

type HSSLGameProp = {
    game: HSSLGame
}

const HSSLGameView: React.FunctionComponent<HSSLGameProp> = (props) => {
    return (
        <Box>
            
        </Box>
    )
};

export default HSSLGameView;