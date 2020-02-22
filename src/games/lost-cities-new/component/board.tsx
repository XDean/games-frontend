import React from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {LCGame} from "../model/board";
import {SocketTopicSender} from "../../common/model/socket";

const useStyles = makeStyles({

});

type LCBoardProp = {
    game: LCGame
    sender: SocketTopicSender
}

const LCBoardView: React.FunctionComponent<LCBoardProp> = (props) => {
    return (
        <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <Box>
                <LCHandView cards={createCards(8)} unknown/>
            </Box>
            <Box>
                <ChatView controller={props.game.plugins.chat} sender={props.sender}/>
            </Box>
        </ThemeProvider>
    )
};

export default LCBoardView;