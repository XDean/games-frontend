import React from 'react';
import {makeStyles, ThemeProvider} from '@material-ui/core/styles';
import {Box} from "@material-ui/core";
import LCHandView from "./hand";
import {createCards} from "../model/card";
import {LCTheme} from "../theme";
import ChatView from "../../common/component/chat";
import {LCGame} from "../model/board";
import {SocketTopicSender} from "../../common/model/socket";
import LCColorBoardView from "./color-board";

const useStyles = makeStyles({
    chat: {
        height: 300,
        position: "relative",
    }
});

type LCBoardProp = {
    game: LCGame
    sender: SocketTopicSender
}

const LCBoardView: React.FunctionComponent<LCBoardProp> = (props) => {
    const classes = useStyles();
    return (
        <ThemeProvider theme={outer => ({...outer, ...LCTheme})}>
            <Box>
                <LCHandView cards={createCards(8)} unknown/>
            </Box>
            <LCColorBoardView board={props.game.board} color={0} rightSeat={props.game.host.mySeat.value}/>
            <LCColorBoardView board={props.game.board} color={1} rightSeat={props.game.host.mySeat.value}/>
            <LCColorBoardView board={props.game.board} color={2} rightSeat={props.game.host.mySeat.value}/>
            <LCColorBoardView board={props.game.board} color={3} rightSeat={props.game.host.mySeat.value}/>
            <LCColorBoardView board={props.game.board} color={4} rightSeat={props.game.host.mySeat.value}/>
            <ChatView controller={props.game.plugins.chat} sender={props.sender} className={classes.chat}/>
        </ThemeProvider>
    )
};

export default LCBoardView;