import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {HSSLPlayer} from "../model/game";

const useStyles = makeStyles({});

type HSSLPlayerProp = {
    player: HSSLPlayer
}

const HSSLPlayerView: React.FunctionComponent<HSSLPlayerProp> = (props) => {
    return (
        <Paper elevation={3}>

        </Paper>
    )
};

export default HSSLPlayerView;