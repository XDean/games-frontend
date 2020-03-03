import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {MultiPlayerMessage} from "../../common/model/multi-player/message";
import {HSSLGame} from "../model/game";
import {HSSLMessage} from "../model/message";
import MultiPlayerMessageView from "../../common/component/multiPlayerMessage";

const useStyles = makeStyles({});

type HSSLMessageProp = {
    game: HSSLGame
    message: HSSLMessage
}

const HSSLMessageView: React.FunctionComponent<HSSLMessageProp> = (props) => {
    return <MultiPlayerMessageView message={props.message as MultiPlayerMessage}/>
};

export default HSSLMessageView;